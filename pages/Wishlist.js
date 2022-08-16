//React
import { useEffect, useState } from "react";
//React-firebase-hook
import { useAuthState } from "react-firebase-hooks/auth";
//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// firebase
import { auth,db } from "../lib/firebase";
//nextjs
import router from "next/router";
import Link from "next/link";
import Image from "next/image";
//components
import Grid from "../components/Grid";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner"
//firestore
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
//HeroIcon
import { CloudIcon } from "@heroicons/react/outline";
import NavBottom from "../components/NavBottom";
import Head from "next/head";
import { onAuthStateChanged } from "firebase/auth";

const Wishlist = ({ items }) => {
  const [user] = useAuthState(auth);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const ref = doc(db, "users", user?.uid);
        const userRef = await getDoc(ref);

        const cart = userRef.data().cart;
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
          wishlist.forEach((item) => {
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

  const removeItem = async (id) => {
    const ref = doc(db, "users", user?.uid);
    await updateDoc(ref, {
      cart: arrayRemove(id),
    });
    toast.success("Item removed from wishlist");
    router.reload(window.location.pathname);
  };

  if (loading) return <Spinner />;
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/Login");
    }
  });

  return (
    <div
      className={`p-[1rem] py-[5rem] md:p-[5rem] bg-gray-200 ${
        wishlistData?.length < 4 ? "h-screen" : "h-full"
      } ${
        wishlist?.length > 0 ? "" : "flex items-center justify-center"
      } overflow-y-auto space-y-3`}
    >
      <Head>
        <title>Wishlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NavBottom />
      {wishlist?.length > 0 ? (
        <div className="space-y-4">
          <h1 className="font-bold text-2xl">Wishlist</h1>
          <Grid>
            {wishlistData.map((post) => {
              return (
                <div>
                  <Link href={`/Product/${post.id}`} key={post.title}>
                    <div
                      className="bg-white rounded-lg space-y-2 max-w-[25rem] min-w-[15rem] md:max-w-[20rem] pb-5 md:h-[22rem] hover:ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-300"
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
      )}
      <ToastContainer/>
    </div>
  );
};

export default Wishlist;

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
