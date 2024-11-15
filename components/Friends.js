//helper function in lib
import getRecipientUser from "../lib/getRecipientUser";
//component
import Avatar from "./Avatar";
//react firebase hook
import { useAuthState } from "react-firebase-hooks/auth";
//firebase
import { auth, db } from "../lib/firebase";
import { collection, where, getDocs, query } from "firebase/firestore";
//nextjs
import { useRouter } from "next/router";
//reactjs
import { useEffect, useState } from "react";

const Friends = ({ id, users }) => {
  const Router = useRouter();
  const [user] = useAuthState(auth);

  const RecipientEmail = getRecipientUser(users, user);

  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    const getUserData = async () => {
      if (RecipientEmail) {
        const q = query(
          collection(db, "users"),
          where("email", "==", RecipientEmail)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUserInfo([doc.data()]);
        });
      }
    };
    getUserData().catch((error) => {
      console.error("Error getting user data:", error);
    });
  }, [RecipientEmail]);

  const getChat = () => {
    if (id) {
      Router.push(`/Chat/${id}`);
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center space-x-5 p-3 pl-2 pr-10 hover:bg-slate-100 transition ease-in-out duration-600"
      onClick={getChat}
    >
      {RecipientEmail && <Avatar email={RecipientEmail} />}
      {userInfo.length > 0 && <h1>{userInfo[0]?.userName}</h1>}
    </div>
  );
};

export default Friends;
