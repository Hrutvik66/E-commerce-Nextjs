import {
  HomeIcon,
  BellIcon,
  MenuIcon,
  UserCircleIcon,
  XIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Link from "next/link";
import Tooltip from "./Tooltip";

const Navbar = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isAccountClicked, setIsAccountClicked] = useState(false);

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

  return (
    <div className="flex items-center fixed top-0 left-0 z-50 w-screen h-[3.5rem] border-gray-500 border-b-[1px] bg-white">
      <ul className="flex justify-between items-center w-full px-[5rem]">
        {/* Logo */}
        <li className="tracking-widest font-bold text-[1.5rem] text-indigo-400">
          BROCHER
        </li>
        {/* Navbar Items */}
        <li>
          <ul className="flex space-x-14">
            <li>
              <Tooltip tooltipText="Home">
                <Link href="/" className="font-light">
                  <HomeIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Notification">
                <Link href="#">
                  <BellIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Search">
                <Link href="#">
                  <SearchIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Sell Item">
                <Link href="/SellItems">
                  <PlusCircleIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600" />
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip tooltipText="Item List">
                {!isMenuClicked && (
                  <MenuIcon
                    className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600 transition-all duration-3000"
                    onClick={() => setIsMenuClicked(!isMenuClicked)}
                    id="menu-icon"
                  />
                )}
                {isMenuClicked && (
                  <XIcon
                    className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600"
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
                        class="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabindex="-1"
                        id="menu-item-0"
                      >
                        Electronic
                      </a>
                      <a
                        href="#"
                        class="text-gray-700 block px-4 py-2 text-sm"
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
              <Tooltip tooltipText="Cart">
                <Link href="/Cart">
                  <ShoppingCartIcon className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600" />
                </Link>
              </Tooltip>
            </li>
            {/* Profile */}
            <li>
              <UserCircleIcon
                className="w-full h-8 text-violet-400 stroke-[1px] hover:text-violet-600"
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
                    <a
                      href="#"
                      class="text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-1"
                    >
                      Account settings
                    </a>
                    <form method="POST" action="#" role="none">
                      <button
                        type="submit"
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                        role="menuitem"
                        tabindex="-1"
                        id="menu-item-3"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
