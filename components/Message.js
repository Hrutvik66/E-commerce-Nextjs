import { TrashIcon } from "@heroicons/react/outline";
// import moment from 'moment';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const Message = ({ user, message }) => {
  const [LoggedInUser] = useAuthState(auth);
  const userType = user === LoggedInUser.email ? "sender" : "receiver";
  // const Trash = async (id) => {
  //   await deleteDoc(doc(ref, 'messages', id));
  // };
  return (
    <div>
      {userType === "sender" ? (
        <div
          className="m-2 ml-auto w-fit min-w-[5rem] rounded-b-lg rounded-tl-lg bg-blue-700 p-2 text-white hover:opacity-50"
          // onClick={() => Trash(message?.id)}
        >
          <p> {message?.message}</p>
          <p className="text-right text-[10px]">
            {/* {message?.timestamp
              ? moment(message?.timestamp).format('LT')
              : '...'} */}
          </p>
        </div>
      ) : (
        <div className="m-2 ml-0 w-fit min-w-[5rem] rounded-b-lg rounded-tr-lg bg-gray-300 p-2">
          <p>{message?.message}</p>
          <p className="text-right text-[10px]">
            {/* {message?.timestamp
              ? moment(message?.timestamp).format('LT')
              : '...'} */}
          </p>
        </div>
      )}
    </div>
  );
};

export default Message;
