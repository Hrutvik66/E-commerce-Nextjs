//React
import { useEffect, useState } from "react";
//Heroicons
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChatIcon } from "@heroicons/react/solid";
//Firebase
import { auth, db } from "../lib/firebase";
import {
  query,
  collection,
  where,
  setDoc,
  getDocs,
  doc,
  docs
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

const Sidebar = () => {
  const [user, loading] = useAuthState(auth);
  const [searchedUserInfo, setSearchedUserInfo] = useState([]);
  const [chats, setChats] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    const getChats = async () => {
      if (user) {
        const chatRef = collection(db, "chats");
        const q = query(chatRef, where("users", "array-contains", user.email));
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
        setChats(data);
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

  if (loading) return <Spinner />;
  if (!user) {
    Router.push("/");
  }

  const createChat = async () => {
    const input = prompt("Enter email address");
    if (!input) {
      toast.error("Please enter an email address");
      return;
    }

    const isEmailValid = () => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(input));
    };
    const checkEmail = () => {
      if (!isEmailValid()) {
        toast.error("Please enter a valid email address");
        return false;
      }
      return true;
    };

    const isUserExists = async () => {
      const ref = doc(db, "users", input);
      const userRef = await getDoc(ref);
      if (!userRef.exists) {
        toast.error("User does not exist");
        return false;
      } else return true;
    };

    if (checkEmail() && isUserExists()) {
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        users: [user?.email, input],
      });
      toast.success("Chat created");
    }
  };

  return (
    <div className="space-y-5 p-3 bg-slate-200 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Image
          src={user ? user?.photoURL : Profile}
          alt="Profile-image"
          className="cursor-pointer rounded-full hover:opacity-50"
          onClick={() => {
            auth.signOut();
            Router.push("/");
          }}
          width={40}
          height={40}
        />
        <div className="flex items-center space-x-4 text-gray-700">
          <ChatIcon
            className="h-9 w-9 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out  hover:bg-white hover:shadow-2xl"
            onClick={createChat}
          />
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
