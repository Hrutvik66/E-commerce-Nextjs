//React
import { useState } from "react";
//Hero icons
import { LockClosedIcon } from "@heroicons/react/solid";

//firebase
import { createUserWithEmailAndPassword,auth } from "../lib/firebase";

const Signup = () => {
  // const Navigate = useNavigate();
  //React States
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });
  const [message, setMessage] = useState({
    emailMessage: "",
    passwordMessage: "",
    c_passwordMessage: "",
  });

  //* Validations
  const isRequired = (value) => (value === "" ? false : true);

  //Email validation
  const isEmailValid = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  //Password strength
  const isPasswordSecure = (password) => {
    const re = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return re.test(password);
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
  //Password check
  const checkPassword = () => {
    let password = userData.password;
    if (!isRequired(password)) {
      setMessage((prev) => ({
        ...prev,
        passwordMessage: "Password is required",
      }));
      return false;
    } else if (!isPasswordSecure(password)) {
      setMessage((prevState) => ({
        ...prevState,
        passwordMessage:
          "Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)",
      }));
      return false;
    }
    return true;
  };
  //Confirm password check
  const checkConfirmPassword = () => {
    let c_password = userData.c_password;
    if (!isRequired(c_password)) {
      setMessage((prev) => ({
        ...prev,
        c_passwordMessage: "Confirm password is required",
      }));
      return false;
    } else if (userData.password !== c_password) {
      setMessage((prevState) => ({
        ...prevState,
        c_passwordMessage: "Password does not match",
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

  // Handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setMessage(() => ({
        emailMessage: "",
        passwordMessage: "",
        c_passwordMessage: "",
      }));
      if (checkEmail() && checkPassword() && checkConfirmPassword()) {
        createUserWithEmailAndPassword(auth, userData.email, userData.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            if (!user.emailVerified) {
              
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
              setMessage((prev) => ({
                ...prev,
                emailMessage: "Email already in use",
              }));
            }
          });
      } else {
        setUserData(() => ({
          name: "",
          email: "",
          password: "",
          c_password: "",
        }));
      }
    } catch (error) {
      console.log(error);
      // Navigate("/SignUp");
    }
  };

  const handleGoogleSignIn = () => {
    
  }
  return (
    <div className="flex items-center justify-center h-screen p-5">
      <div className="space-y-[1rem]">
        <div className="space-y-[0.5rem]">
          <LockClosedIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <div className="space-y-[0.5rem]">
          <label htmlFor="Name" className="sr-only">
            Name
          </label>
          <input
            className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md"
            type="input"
            name="name"
            id="Name"
            required
            placeholder="Enter Full Name"
            onChange={handleChange}
            value={userData.name}
          />
        </div>
        <div>
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
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md"
            type="password"
            name="password"
            id="password"
            required
            placeholder="Password"
            onChange={handleChange}
            value={userData.password}
          />
        </div>
        <div>
          <label htmlFor="c_password" className="sr-only">
            Password
          </label>
          <input
            className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md"
            type="password"
            name="c_password"
            id="c_password"
            required
            placeholder="Confirm Password"
            onChange={handleChange}
            value={userData.c_password}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-violet-700 p-2 rounded-md text-white focus:ring ring-violet-500 ring-offset-4"
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </div>
        <div className="flex justify-center">
          <hr className="w-[50%] bg-black my-3 h-[1.5px]" />
        </div>
        <div>
          <button
            type="button"
            className="w-full bg-white border-[1.5px] border-black p-2 rounded-md flex content-center justify-center hover:border-violet-700"
            onClick={handleGoogleSignIn}
          >
            <img
              src="../../images/google.png"
              alt="google"
              className="w-5 h-5 mr-5"
            />
            Signup with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
