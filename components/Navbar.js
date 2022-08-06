// HeroIcon
import {
  HomeIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  PlusCircleIcon,
  SearchIcon,
  HeartIcon,
} from "@heroicons/react/outline";
//React
import { useEffect, useState } from "react";
//Nextjs
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
//Components
import Tooltip from "./Tooltip";
//react-firebase-hook
import { useAuthState } from "react-firebase-hooks/auth";
//firebase
import { auth } from "../lib/firebase";
//Auth
import { signOut } from "firebase/auth";
//Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Image
import Profile from "../public/images/default_profile.png";

const Navbar = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isAccountClicked, setIsAccountClicked] = useState(false);
  const [user] = useAuthState(auth);

  const List = [
    {
      name: "Electronic",
      link: "/Electronic",
    },
  ];

  const Account_items = [
    {
      name: "Account",
      link: "/Account",
    },
    {
      name: "Log Out",
    },
  ];

  const Signout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
        toast.success("User signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        toast.error("Error in signing out of the application");
      });
  };

  return (
    <div className="flex items-center fixed top-0 left-0 z-30 w-screen h-[3.5rem] shadow-md bg-white">
      <ul className="flex justify-between items-center w-full px-[5rem]">
        {/* Logo */}
        <li className="tracking-widest font-bold text-[1.5rem] text-indigo-400">
          <Link href="/">BROCHER</Link>
        </li>
        {/* Navbar Items */}
        <li>
          <ul className="flex space-x-14">
            <li>
              <Tooltip tooltipText="Home">
                <Link href="/" className="font-light">
                  <HomeIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Notification">
                <Link href="#">
                  <BellIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Search">
                <Link href="#">
                  <SearchIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Sell Item">
                <Link href="/SellItems">
                  <PlusCircleIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Item List">
                {!isMenuClicked && (
                  <MenuIcon
                    className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer transition-all duration-3000"
                    onClick={() => setIsMenuClicked(!isMenuClicked)}
                    id="menu-icon"
                  />
                )}
                {isMenuClicked && (
                  <XIcon
                    className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer"
                    onClick={() => setIsMenuClicked(!isMenuClicked)}
                    id="menu-icon"
                  />
                )}
                {isMenuClicked && (
                  <div
                    className="origin-top-right absolute top-[105%] right-[-4rem] w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-icon"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <a
                        href="#"
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabindex="-1"
                        id="menu-item-0"
                      >
                        Electronic
                      </a>
                      <a
                        href="#"
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabindex="-1"
                        id="menu-item-2"
                      >
                        Books
                      </a>
                    </div>
                  </div>
                )}
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Wishlist">
                <Link href="/Wishlist">
                  <HeartIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
                </Link>
              </Tooltip>
            </li>
            {/* Profile */}
            <li>
              <Image
                src={user ? user.photoURL : Profile}
                width={32}
                height={32}
                className={`rounded-full cursor-pointer ${
                  user ? "" : "animate-bounce"
                }`}
                alt="profile"
                onClick={() => setIsAccountClicked(!isAccountClicked)}
              />
              {isAccountClicked && (
                <div
                  className="origin-top-right absolute top-[105%] right-[1rem] w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-icon"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    {user ? (
                      <a
                        href="#"
                        className="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-1"
                      >
                        Account settings
                      </a>
                    ) : (
                      <Link href="/Login">
                        <span className="text-white block px-4 py-2 text-sm bg-black w-full cursor-pointer">
                          Log in
                        </span>
                      </Link>
                    )}
                    <button
                      type="submit"
                      className="text-gray-700 block w-full text-left px-4 py-2 text-sm cursor-pointer"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-3"
                      onClick={Signout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </li>
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
