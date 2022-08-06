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
//Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Image
import Profile from "../public/images/default_profile.png";

const NavBottom = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isAccountClicked, setIsAccountClicked] = useState(false);
  const [user] = useAuthState(auth);

  return (
    <div className="flex items-center fixed bottom-0 left-0 z-30 w-screen h-[3.5rem] shadow-md bg-white md:hidden">
      <ul className="flex justify-between items-center space-x-7 px-[0.9rem] md:p-[4rem] w-full h-full">
        <li>
          <Link href="/" className="font-light">
            <HomeIcon className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
          </Link>
        </li>
        <li>
          <Link href="#">
            <BellIcon className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
          </Link>
        </li>
        <li>
          <Link href="/SellItems">
            <PlusCircleIcon className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
          </Link>
        </li>
        <li>
          {!isMenuClicked && (
            <MenuIcon
              className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer transition-all duration-3000"
              onClick={() => setIsMenuClicked(!isMenuClicked)}
              id="menu-icon"
            />
          )}
          {isMenuClicked && (
            <XIcon
              className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer"
              onClick={() => setIsMenuClicked(!isMenuClicked)}
              id="menu-icon"
            />
          )}
          {isMenuClicked && (
            <div
              className="origin-top-right absolute bottom-[110%] right-[4.7rem] w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150"
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
        </li>
        <li>
          <Link href="#">
            <SearchIcon className="w-full h-10 md:h-8 text-violet-400 stroke-[1px] hover:text-violet-600 cursor-pointer" />
          </Link>
        </li>
      </ul>
      <ToastContainer />
    </div>
  );
};

export default NavBottom;
