//Nextjs
import Head from "next/head";
//component
import Sidebar from "../../components/Sidebar";
import Chatwindow from "../../components/Chatwindow";
//firebase
import { db, auth } from "../../lib/firebase";
import { getDoc, orderBy, doc, getDocs, collection } from "firebase/firestore";
//helper function from lib
import getRecipientUser from "../../lib/getRecipientUser";
//react firebase hook
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Chats = ({ chat, messages }) => {
  const [user, loading] = useAuthState(auth);
  const Router = useRouter();
  if (loading) return <Spinner />;
  if (!user) {
    toast.error("Please Login first");
    Router.push("/");
  }
  const RecipientEmail = getRecipientUser(chat.users, user);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-200">
      <Head>
        <title>Chat</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="hidden md:inline">
        <Sidebar />
      </div>
      <Chatwindow email={RecipientEmail} messages={messages} />
    </div>
  );
};

export default Chats;

export async function getServerSideProps(context) {
  const ref = doc(db, "chats", context.query.id);
  const chatRef = await getDoc(ref);

  const messagesRef = await getDocs(
    collection(ref, "messages"),
    orderBy("timestamp", "asc")
  );
  const messages = messagesRef?.docs
    ?.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    ?.map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chat = {
    id: chatRef.id,
    ...chatRef.data(),
  };

  return {
    props: { chat: chat, messages: JSON.stringify(messages) },
  };
}
