import Image from "next/image";
import { useEffect, useState } from "react";
//Firebase
import { db } from "../lib/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

const Avatar = ({ email }) => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUrl(doc.data().photoURL);
      });
    };
    getUserData();
  }, [email]);

  return (
    <div className="hover:bg-gray-600">
      {url && (
        <Image
          src={url}
          alt="Profile"
          height={40}
          width={40}
          className="rounded-full"
          priority="true"
        />
      )}
    </div>
  );
};

export default Avatar;
