"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { ChatAlt2Icon, HeartIcon, XIcon } from "@heroicons/react/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db, auth } from "../../lib/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import HorizontalGrid from "../../components/HorizontalGrid";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import NavBottom from "../../components/NavBottom";
import getRecipientUser from "../../lib/getRecipientUser";

import Profile from "../../public/images/default_profile.png";

export default function Product({ item, seller }) {
  const [activeTab, setActiveTab] = useState("details");
  const [user, loading] = useAuthState(auth);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setWishlist(userDoc.data()?.cart || []);
      }
    };
    getData();
  }, [user]);

  useEffect(() => {
    const getChats = async () => {
      if (user) {
        const chatQuery = query(
          collection(db, "chats"),
          where("users", "array-contains", user.email)
        );
        const querySnapshot = await getDocs(chatQuery);
        setChats(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    };
    getChats();
  }, [user]);

  useEffect(() => {
    setIsWishlisted(wishlist.includes(item.id));
  }, [wishlist, item.id]);

  if (loading) return <Spinner />;

  const wishlistItem = async () => {
    try {
      if (!user) {
        toast.error("Please Login first");
        router.push("/Login");
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          cart: arrayUnion(item.id),
        });
        toast.success("Added to wishlist");
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in adding to wishlist. Please try again later.");
    }
  };

  const notifySeller = async (data) => {
    try {
      const newNotification = {
        message: data.message,
        time: new Date().toLocaleTimeString(),
        link: data.link,
        isClicked: false,
      };
      const sellerRef = doc(db, "users", JSON.parse(seller).id);
      const notificationRef = doc(collection(sellerRef, "notification"));
      await setDoc(notificationRef, newNotification);
      toast.success("Notification sent to seller");
    } catch (error) {
      console.error(error);
      toast.error("Error in sending notification. Please try again later.");
    }
  };

  const chatWithSeller = async () => {
    if (!confirm("Are you sure you want to chat with this seller?")) {
      return toast.error("Chat creation cancelled");
    }

    try {
      const sellerEmail = JSON.parse(seller).email;
      const existingChat = chats.find(
        (chat) => getRecipientUser(chat.users, user) === sellerEmail
      );

      if (existingChat) {
        return toast.error("Chat already exists.");
      }

      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        users: [user.email, sellerEmail],
      });

      const notificationData = {
        userName: user.displayName,
        productName: item.title,
        email: sellerEmail,
        link: `https://e-commerce-nextjs-gray.vercel.app/Chat/${newChatRef.id}`,
        message: `Hey there, Our customer ${user.displayName} is interested in your product ${item.title}. They want to chat with you.`,
      };

      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      await notifySeller(notificationData);
      toast.success("Chat created successfully 🎉");
      router.push("/Chat");
    } catch (error) {
      console.error(error);
      toast.error("Error creating chat. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:pt-20">
      <Head>
        <title>{item.title} | Your Store Name</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={item.images[1]}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {item.title}
              </h1>
              <p className="text-2xl font-semibold text-red-600 mb-6">
                Rs {item.price}
              </p>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={wishlistItem}
                  className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                    isWishlisted
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-red-600 text-white hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  disabled={isWishlisted}
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
                <button
                  onClick={chatWithSeller}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChatAlt2Icon className="h-5 w-5 mr-2" />
                  Chat with Seller
                </button>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Seller Information
                </h2>
                <div className="flex items-center">
                  <Image
                    src={JSON.parse(seller)?.photoURL || Profile}
                    width={40}
                    height={40}
                    alt={JSON.parse(seller)?.userName}
                    className="rounded-full"
                  />
                  <p className="ml-4 text-sm font-medium text-gray-900">
                    {JSON.parse(seller)?.userName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="flex">
              {["details", "description", "images"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-1 text-center text-sm font-medium ${
                    activeTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "details" && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Product Details
                  </h3>
                  <p>{item.features}</p>
                </div>
              )}
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Product Description
                  </h3>
                  <p>{item.description}</p>
                </div>
              )}
              {activeTab === "images" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Product Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Image
                          src={image}
                          alt={`${item.title} - Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <NavBottom />
      <ToastContainer />
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Enlarged product image"
              width={800}
              height={600}
              objectFit="contain"
              className="rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const itemRef = doc(db, "items", context.query.id);
  const itemDoc = await getDoc(itemRef);

  const sellerRef = doc(db, "users", itemDoc.data().user);
  const sellerDoc = await getDoc(sellerRef);

  return {
    props: {
      item: { id: itemDoc.id, ...itemDoc.data() },
      seller: JSON.stringify({ id: sellerDoc.id, ...sellerDoc.data() }),
    },
  };
}
