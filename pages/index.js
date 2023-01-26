import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import HorizontalGrid from "../components/HorizontalGrid";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import NavBottom from "../components/NavBottom";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "../components/Spinner";

const Home = ({ items, Types }) => {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          console.log(result.user);
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          if (result.additionalUserInfo.isNewUser) {
            setData(result.user);
          } else {
            toast.success("Log in success");
          }
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log(error);
        });
    }
  }, []);
  if (loading) return <Spinner />;
  return (
    <div className="bg-gray-200 h-screen overflow-y-auto">
      <Head>
        <title>Brocher</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NavBottom />
      <NavBottom />
      <main className="p-[1rem] py-[5rem] md:p-[5rem] space-y-10">
        {Types.map((product) => {
          return (
            <HorizontalGrid key={product} heading={product}>
              {items
                .filter((post) => {
                  return post.type === product; // ? For spliting .slice(0, 7)
                })
                .map((post) => {
                  return (
                    <Link href={`/Product/${post.id}`} key={post.title}>
                      <div
                        className="bg-white rounded-lg space-y-2 max-w-[15rem] min-w-[15rem] md:max-w-[20rem] pb-5 h-[19rem] md:h-[22rem] hover:ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-300 cursor-pointer"
                        key={post}
                      >
                        <Image
                          src={`${post.images[0]}`}
                          alt={post.title}
                          height={300}
                          width={400}
                          priority={true}
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                        <div className="px-4">
                          <p className="font-semibold text-lg">{`₹ ${post.price}`}</p>
                          <p className="text-gray-500">{`${post.description.substring(
                            0,
                            70
                          )}...`}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </HorizontalGrid>
          );
        })}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "items"));
  const Types = [
    ...new Set(
      querySnapshot?.docs?.map((item) => {
        return item.data().type;
      })
    ),
  ];

  const items = [
    ...new Set(
      querySnapshot?.docs?.map((item) => {
        return { id: item.id, ...item.data() };
      })
    ),
  ];

  return {
    props: { items: items, Types: Types }, // will be passed to the page component as props
  };
}
