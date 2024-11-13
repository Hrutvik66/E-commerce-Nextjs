"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HomeIcon,
  BellIcon,
  PlusCircleIcon,
  HeartIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";

import { auth, db } from "../lib/firebase";
import { doc, getDocs, collection, getDoc } from "firebase/firestore";

import Tooltip from "./Tooltip";
import Profile from "../public/images/default_profile.png";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [numberNotify, setNumberNotify] = useState(0);
  const [numberNotifyUser, setNumberNotifyUser] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        setNumberNotifyUser(userSnap.data()?.Notifications || 0);

        const notifySnap = await getDocs(collection(userRef, "notification"));
        setNumberNotify(notifySnap.size);
      }
    };
    getData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              BROKAR
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex space-x-8">
              <NavItem href="/" icon={HomeIcon} tooltip="Home" />
              <NavItem
                href="/Notification"
                icon={BellIcon}
                tooltip="Notifications"
                badge={numberNotify > numberNotifyUser}
              />
              <NavItem
                href="/SellItems"
                icon={PlusCircleIcon}
                tooltip="Sell Item"
              />
              <NavItem href="/Chat" icon={ChatAlt2Icon} tooltip="Chat" />
              <NavItem href="/Wishlist" icon={HeartIcon} tooltip="Wishlist" />
            </div>
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Image
                    src={user?.photoURL || Profile}
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="Profile"
                  />
                </button>
              </div>
              {isAccountMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user ? (
                    <>
                      <Link
                        href="/Profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/Login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log in
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

const NavItem = ({ href, icon: Icon, tooltip, badge }) => (
  <Tooltip tooltipText={tooltip}>
    <Link href={href} className="text-gray-600 hover:text-indigo-600">
      <div className="relative">
        <Icon className="w-8 h-8" />
        {badge && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </div>
    </Link>
  </Tooltip>
);

export default Navbar;
