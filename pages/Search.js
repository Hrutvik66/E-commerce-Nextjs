import React from "react";
//Components
import NavBottom from "../components/NavBottom";
import Navbar from "../components/Navbar";
import Head from "next/head";

const Search = () => {
  const searchItem = () => {};
  return (
    <div className="p-[1rem] pt-[7rem] pb-[5rem] md:[p-5rem] h-screen">
      <Head>
        <title>Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NavBottom />
      <div className="flex justify-center space-x-6">
        <input
          type="text"
          placeholder="Search"
          className="rounded p-4 bg-gray-200 w-[40rem]"
        />
        <button
          className="px-[2rem] bg-red-600 rounded text-white"
          onClick={searchItem}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
