"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  BellIcon,
  PlusCircleIcon,
  HeartIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBottom = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.1)]">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavItem href="/" icon={HomeIcon} />
          <NavItem href="/Notification" icon={BellIcon} />
          <NavItem href="/SellItems" icon={PlusCircleIcon} />
          <NavItem href="/Chat" icon={ChatAlt2Icon} />
          <NavItem href="/Wishlist" icon={HeartIcon} />
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

const NavItem = ({ href, icon: Icon }) => (
  <Link href={href} className="text-gray-600 hover:text-indigo-600">
    <Icon className="w-8 h-8" />
  </Link>
);

export default NavBottom;
