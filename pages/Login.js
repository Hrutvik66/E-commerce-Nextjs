//React
import { useState, useEffect } from "react";
//Nextjs
import router from "next/router";
import Head from "next/head";
//Hero icons
import { LockClosedIcon, MailIcon } from "@heroicons/react/solid";
//toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//firebase
import { auth, provider, signInWithRedirect, db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
//React-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";

const Login = () => {
  //react-firebase-hook
  const [user] = useAuthState(auth);
  //React States
  const [userData, setUserData] = useState({
    email: "",
  });
  const [message, setMessage] = useState({
    emailMessage: "",
  });
  // const [remember, setRemember] = useState(false);

  //* Validations

  const isRequired = (value) => (value === "" ? false : true);

  //Email validation
  const isEmailValid = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  //Email check
  const checkEmail = () => {
    let email = userData.email;
    if (!isRequired(email)) {
      setMessage((prev) => ({ ...prev, emailMessage: "Email is required" }));
      return false;
    } else if (!isEmailValid(email)) {
      setMessage((prevState) => ({
        ...prevState,
        emailMessage: "Email is not valid.",
      }));
      return false;
    }
    return true;
  };

  // Handle changes in the form
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const actionCodeSettings = {
    url: "http://localhost:3000/",
    // This must be true.
    handleCodeInApp: true,
  };
  // Handle link login
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setMessage(() => ({
        emailMessage: "",
      }));
      if (checkEmail()) {
        sendSignInLinkToEmail(auth, userData.email, actionCodeSettings)
          .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            toast.success("Email link sent successfully.");
            window.localStorage.setItem("emailForSignIn", userData.email);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorCode + " : " + errorMessage);
          });
      } else {
        toast.error("Username is invalid!!");
        setUserData(() => ({
          email: "",
        }));
      }
    } catch (error) {
      toast.error("Error in sending mail :(");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setData(user);
        router.push("/");
      }
    });
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  const setData = async (data) => {
    await setDoc(doc(db, "users", data?.uid), {
      email: data?.email,
      photoURL: data?.photoURL,
      userName: data?.displayName,
      Notifications: 0,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen p-5">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="space-y-10">
        <div>
          <LockClosedIcon className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="flex flex-col items-center space-y-5">
          <div className="w-full">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md focus:"
              type="input"
              name="email"
              id="email-address"
              required
              placeholder="Enter Email"
              onChange={handleChange}
              value={userData.email}
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-around bg-indigo-700 p-2 rounded-md text-white focus:ring ring-indigo-500 ring-offset-2 hover:text-blue-600 hover:bg-white hover:border-[2px] transition-all duration-700 ease-in-out border-blue-600"
            onClick={handleSubmit}
            id="loginButton"
          >
            <MailIcon className="h-8 w-8" />
            Log in with Email link
          </button>
          <hr className="bg-black w-[60%] h-[2px]" />
          <button
            type="button"
            className="w-full bg-white border-[1.5px] border-black p-2 rounded-md flex items-center justify-around focus:ring ring-indigo-500 ring-offset-2 hover:border-blue-600 transition-all duration-700 ease-in-out"
            onClick={handleGoogleSignIn}
            id="googleButton"
          >
            <img
              src="../../images/google.png"
              alt="google"
              className="w-6 h-6 mr-5"
            />
            Login with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
