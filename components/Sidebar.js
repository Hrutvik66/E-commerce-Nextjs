//React
import { useEffect, useState } from "react";
//Heroicons
import { DotsVerticalIcon } from "@heroicons/react/outline";
//Firebase
import { auth, db } from "../lib/firebase";
import {
  query,
  collection,
  where,
  setDoc,
  getDocs,
  doc,
  docs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
//React-firebase
import { useAuthState } from "react-firebase-hooks/auth";
//Components
import Friends from "./Friends";
//Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Spinner
import Spinner from "./Spinner";
//Nextjs
import Image from "next/image";
import { useRouter } from "next/router";
//Profile
import Profile from "../public/images/default_profile.png";
import getRecipientUser from "../lib/getRecipientUser";

const Sidebar = () => {
  const [user, loading, error] = useAuthState(auth);
  const [searchedUserInfo, setSearchedUserInfo] = useState([]);
  const [chats, setChats] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    const getChats = async () => {
      if (user) {
        const chatRef = collection(db, "chats");
        const q = query(chatRef, where("users", "array-contains", user?.email));
        try {
          const querySnapshot = await getDocs(q);

          const data = [
            ...new Set(
              querySnapshot?.docs?.map((doc) => {
                return {
                  id: doc.id,
                  ...doc.data(),
                };
              })
            ),
          ];
          console.log(data);

          // check for empty objects and remove them
          data.forEach((chat) => {
            if (Object.keys(chat).length === 0) {
              data.splice(data.indexOf(chat), 1);
            }
          });

          // check for same users are in same room
          data.forEach((chat, index) => {
            if (chat.users.length === 2 && chat.users[0] == chat.users[1]) {
              data.splice(index, 1);
            }
          });

          setChats(data);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    getChats();
  }, [user]);

  if (loading) return <Spinner />;
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      Router.push("/");
    }
  });

  if (!user) {
    Router.push("/");
  }

  return (
    <div className="space-y-5 p-3 bg-slate-200 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Image
          src={user?.photoURL || Profile}
          alt="Profile-image"
          className="cursor-pointer rounded-full hover:opacity-50"
          onClick={() => {
            auth.signOut();
            Router.push("/");
          }}
          width={40}
          height={40}
        />
        <div className="flex items-center text-gray-700">
          <DotsVerticalIcon className="h-7 w-7 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out hover:bg-white hover:shadow-2xl" />
        </div>
      </div>
      {/* SearchBar */}
      <div className="flex justify-center space-x-6">
        <input
          type="text"
          placeholder="Search"
          className="rounded p-4 bg-white w-[90%] focus:ring-2 ring-offset-2 ring-offset-gray-200 ring-gray-400 outline-none transition-all duration-700 ease-in-out"
        />
        <button
          className="px-[2rem] bg-red-600 rounded text-white"
          // onClick={searchItem}
        >
          Search
        </button>
      </div>
      {/* List of friends */}
      <div className=" rounded-lg bg-white">
        {chats &&
          chats?.map((chat) => {
            return <Friends key={chat.id} id={chat.id} users={chat.users} />;
          })}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
