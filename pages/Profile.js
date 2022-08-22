import { useState, useEffect } from "react";
//Components
import NavBottom from "../components/NavBottom";
import Navbar from "../components/Navbar";
//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
//firebase
import { auth, db } from "../lib/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
//Nextjs
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
//auth state change
import { onAuthStateChanged } from "firebase/auth";
import Grid from "../components/Grid";
//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//image
import ProfilePhoto from "../public/images/default_profile.png";

const Profile = ({ items }) => {
  const [user] = useAuthState(auth);
  const [on, setOn] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const ref = doc(db, "users", user?.uid);
        const userRef = await getDoc(ref);

        const cart = userRef.data()?.cart;
        setWishlist(cart);
      }
    };
    getData();
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      if (wishlist?.length > 0) {
        let data = [];

        items.filter((product) => {
          wishlist?.forEach((item) => {
            if (item === product.id) {
              data.push(product);
            }
          });
        });
        setWishlistData(data);
      }
    };
    getData();
    setLoading(false);
  }, [wishlist]);

  const handleStyle = (value) => {
    setOn(value);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/Login");
      }
    })
  }, [user]);
  return (
    <div
      className={`p-[1rem] py-[5rem] md:p-[5rem] w-full ${
        wishlist?.length > 0 && on == 2 ? "h-full" : "h-screen"
      } bg-gray-200`}
    >
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NavBottom />
      <div className="flex flex-col lg:flex-row w-full h-full justify-between items-center lg:items-start">
        <div className="flex flex-col space-y-5 p-3 h-full">
          <Image
            src={
              user ? user?.photoURL : ProfilePhoto
            }
            width={200}
            height={200}
            priority
            className="rounded-full"
          />
          {/* <div className="button-div"> */}
          <button
            className={` p-3 rounded  ring-black transition-all duration-700 ease-in-out ${
              on === 1 || on === ""
                ? "bg-white text-black ring-2"
                : "bg-black text-white hover:scale-105"
            }`}
            onClick={() => {
              handleStyle(1);
            }}
          >
            About
          </button>
          <button
            className={`p-3 rounded  ring-black transition-all duration-700 ease-in-out ${
              on === 2
                ? "bg-white text-black ring-2"
                : "bg-black text-white hover:scale-105"
            }`}
            onClick={() => {
              handleStyle(2);
            }}
          >
            Your Items
          </button>
          {/* </div> */}
        </div>
        <div className="w-full md:w-[80%] flex flex-col p-7">
          <h1 className="text-4xl font-bold mb-4">{user?.displayName}</h1>
          <hr className="bg-black mb-9" />
          {(on === 1 || on == "") && (
            <div className="flex flex-col space-y-5">
              <div className="flex justify-between">
                <h1 className="text-xl font-bold">Number of Your Items</h1>
                <h1 className="text-2xl">{wishlist?.length > 0 ? wishlist?.length : "0"}</h1>
              </div>
              <div className="flex justify-between">
                <h1 className="text-xl font-bold">
                  Number of Wishlisted Items
                </h1>
                <h1 className="text-2xl">10</h1>
                {/* todo */}
              </div>
            </div>
          )}
          {on === 2 &&
            (wishlist?.length > 0 ? (
              <div className="space-y-2">
                <Grid>
                  {wishlistData.map((post) => {
                    return (
                      <div>
                        <Link href={`/Product/${post.id}`} key={post.title}>
                          <div
                            className="bg-white rounded-lg space-y-2 max-w-[20rem] min-w-[10rem] md:max-w-[15rem] pb-5 md:h-[19rem] hover:ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-300"
                            key={post.id}
                          >
                            <Image
                              src={`${post.images[0]}`}
                              alt={post.title}
                              height={300}
                              width={400}
                              priority={true}
                              objectFit="cover"
                              className="rounded-t-lg"
                            />
                            <div className="px-4">
                              <p className="font-semibold text-lg">{`₹ ${post.price}`}</p>
                              <p className="text-gray-500">{`${post.description.substring(
                                0,
                                70
                              )}...`}</p>
                            </div>
                          </div>
                        </Link>
                        <button
                          className="bg-red-600 p-3 mt-3 rounded-md text-white hover:ring-2  ring-red-400 hover:bg-white hover:text-black  transition-hover duration-1000 ease-in-out"
                          onClick={() => removeItem(post.id)}
                        >
                          Remove from Wishlist
                        </button>
                      </div>
                    );
                  })}
                </Grid>{" "}
              </div>
            ) : (
              <div className="text-center">
                <CloudIcon className="h-32 w-32 inline  stroke-gray-400" />
                <p className="font-bold text-5xl">No items in wishlist</p>
              </div>
            ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Profile;

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "items"));

  const items = [
    ...new Set(
      querySnapshot?.docs?.map((item) => {
        return { id: item.id, ...item.data() };
      })
    ),
  ];

  return {
    props: { items: items }, // will be passed to the page component as props
  };
}
