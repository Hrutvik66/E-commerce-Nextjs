import React, { useEffect } from "react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Image from "next/image";
import router from "next/router";
import Head from "next/head";
import { useState } from "react";
import HorizontalGrid from "../../components/HorizontalGrid";
import Navbar from "../../components/Navbar";
import { ChatAlt2Icon, HeartIcon } from "@heroicons/react/outline";
import { auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Product = ({ item, seller }) => {
  const [link, setLink] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    wishlist.some((element) => {
      if (element === item.id) {
        setIsWishlisted(true);
      }
    });
  }, [wishlist]);

  if (loading) return <p>Loading...</p>;

  const handleClick = (value) => {
    setLink(value);
  };

  const wishlistItem = async () => {
    try {
      if (!user) {
        toast.error("Please Login first");
        Router.push("/");
      } else {
        const ref = doc(db, "users", item.user);
        await updateDoc(ref, {
          cart: arrayUnion(item.id),
        });
        router.push("/Wishlist");
      }
    } catch (error) {
      console.log(error);
      setError("Error in adding to cart. Please try again later.");
    }
  };

  return (
    <div
      className={`p-5 py-[5rem] md:p-[5rem] bg-gray-200 ${
        item ? "h-full" : "h-screen"
      } overflow-auto`}
    >
      <Head>
        <title>{item.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col md:flex-row space-y-5 md:space-x-5 md:space-y-0">
          <Image
            src={item.images[1]} //! ? is the Optional Chaining operator
            alt={item.title} //! to defend against null/undefined property accesses
            height={400}
            width={500}
            className="rounded-lg"
          />
          <div className="flex flex-col space-y-3 flex-1 justify-between">
            <div className="flex flex-col space-y-3 p-5 bg-white rounded-md">
              <h1 className="font-bold text-3xl">{item.title}</h1>
              <hr className="bg-gray-200 w-full" />
              <h3
                style={{ color: "#FF2341", fontSize: "23px" }}
              >{`Rs ${item.price}`}</h3>
              <div className="flex flex-col space-y-5 lg:flex-row lg:space-x-5 lg:space-y-0">
                {!isWishlisted ? (
                  <button
                    className="flex items-center justify-center bg-black p-3 text-white hover:ring-2  ring-black hover:bg-white hover:text-black  transition-hover duration-1000 ease-in-out rounded-md"
                    onClick={wishlistItem}
                  >
                    <HeartIcon className="md:w-full h-8 text-red-400 stroke-[1px] md:flex-[0.5]" />
                    <span className="ml-2 md:flex-[1.5]">Wishlist</span>
                  </button>
                ) : (
                  <button className="flex items-center justify-center text-green-400 p-3 ring-2  ring-green-400 rounded-md cursor-default">
                    <HeartIcon className="md:w-full h-8 text-green-400 stroke-[1px] md:flex-[0.5]" />
                    <span className="ml-2 md:flex-[1.5]">Wishlisted</span>
                  </button>
                )}
                <button
                  className="flex items-center justify-center border-[2px] border-black hover:bg-black hover:text-white p-1 px-3  transition-hover duration-1000 ease-in-out rounded-md"
                  onClick={chatWithSeller}
                >
                  <ChatAlt2Icon className="md:w-full h-8 text-red-400 stroke-[1px] md:flex-[0.5]" />
                  <span className="ml-2 md:flex-[1.5]">Chat with a Seller</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-3 bg-white p-5 rounded-md">
              <h1 className="font-bold text-3xl">Seller</h1>
              <hr className="bg-gray-200 w-full" />
              <div className="flex space-x-4 items-center">
                <Image
                  src={seller.photoURL}
                  height={60}
                  width={60}
                  alt={seller.userName}
                  className="rounded-full"
                />
                <h3 className="font-semibold text-lg">{seller?.userName}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 overflow-x-auto">
          <div className="flex space-x-2">
            <p
              onClick={() => {
                handleClick(1);
              }}
              className={`${
                link === 1 || link === ""
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              } p-2 rounded-t-lg cursor-pointer transition-all duration-700 ease-in-out`}
            >
              Details
            </p>
            <p
              onClick={() => {
                handleClick(2);
              }}
              className={`${
                link === 2 ? "bg-black text-white" : "hover:bg-gray-200"
              } p-2 rounded-t-lg cursor-pointer transition-all duration-700 ease-in-out`}
            >
              Description
            </p>
            <p
              onClick={() => {
                handleClick(3);
              }}
              className={`${
                link === 3 ? "bg-black text-white" : "hover:bg-gray-200"
              } p-2 rounded-t-lg cursor-pointer transition-all duration-700 ease-in-out`}
            >
              Images
            </p>
          </div>
          <hr className="bg-black mb-3" />
          {link === 1 || link === "" ? (
            <p>{item.features}</p>
          ) : link === 2 ? (
            <p>{item.description}</p>
          ) : link === 3 ? (
            <HorizontalGrid heading="Gallary">
              {item.images.map((image) => {
                return (
                  <div className="">
                    <Image
                      key={image}
                      src={image}
                      alt={item.title}
                      height={400}
                      width={500}
                    />
                  </div>
                );
              })}
            </HorizontalGrid>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

export async function getServerSideProps(context) {
  const ref = doc(db, "items", context.query.id);
  const itemRef = await getDoc(ref);

  const sellerRef = doc(db, "users", itemRef.data().user);
  const userRef = await getDoc(sellerRef);
  const seller = userRef.data();

  const item = {
    id: itemRef.id,
    ...itemRef.data(),
  };

  return {
    props: { item: item, seller: seller },
  };
}
