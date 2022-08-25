import React, { useEffect, useState } from "react";
//firebase
import { auth, db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
//Components
import Navbar from "../components/Navbar";
import NavBottom from "../components/NavBottom";
//Nextjs
import Head from "next/head";
import router from "next/router";
//Hero-icon
import { BellIcon, TrashIcon } from "@heroicons/react/outline";
//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";

const Notification = () => {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState([{}]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      if (user) {
        const ref = doc(db, "users", user?.uid);
        const NotifyRef = await getDocs(collection(ref, "notification"));

        const data = [
          ...new Set(
            NotifyRef?.docs?.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          ),
        ];
        setNotifications(data);
        setLoading(false);
      }
    };
    getData();
  }, [user]);

  const deleteMessage = async (id) => {
    const ref = doc(db, "users", user?.uid);
    const userRef = await getDoc(ref);
    await deleteDoc(doc(ref, "notification", id));
    if (userRef?.data().Notifications)
      await updateDoc(ref, {
        Notifications: increment(-1),
      });
    toast.success("Notification removed from wishlist");
    router.reload(window.location.pathname);
  };

  const updateData = async (data) => {
    if (data?.isClicked == false) {
      const ref = doc(db, "users", user?.uid);
      const notifyDoc = doc(ref, "notification", data?.id);
      await updateDoc(notifyDoc, {
        isClicked: true,
      });
      await updateDoc(ref, {
        Notifications: increment(1),
      });
    }
    router.push(data?.link);
  };
  return (
    <div
      className={`flex flex-col space-y-3 px-[1rem] py-[5rem] md:p-[5rem] bg-gray-200 ${
        notifications?.length < 7 ? "md:h-screen" : "md:h-full"
      }`}
    >
      <Head>
        <title>Notification</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && <Spinner />}
      <Navbar />
      <NavBottom />

      {notifications?.length > 0 ? (
        <div className="space-y-3">
          <h1 className="font-bold text-2xl">Notifications</h1>
          {notifications?.map((notification) => {
            return (
              <div
                className={`bg-white rounded-md flex flex-col md:flex-row justify-between items-center ${
                  notification?.isClicked ? "" : "bg-blue-300"
                }`}
              >
                {/* <Link href={`${notification?.link}`}> */}
                <div
                  className="p-5 pt-0 space-y-2 cursor-pointer flex-1"
                  onClick={() => updateData(notification)}
                >
                  <p className="text-xs font-thin">{notification?.time}</p>
                  <p>{notification?.message}</p>
                </div>
                {/* </Link> */}
                <div
                  className="border-black border-t-[1px] md:border-l-[1px] md:border-t-0 py-5 md:px-5 md:py-0 hover:text-red-400 cursor-pointer"
                  onClick={() => deleteMessage(notification.id)}
                >
                  <TrashIcon className="h-[1.5rem] w-[30rem] md:h-[5rem] md:w-[1.5rem] stroke-1" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
          <BellIcon className="h-20 w-20 stroke-1 text-red-500 -rotate-45" />
          <h1 className="font-bold text-5xl text-red-500">No Notifications</h1>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Notification;
