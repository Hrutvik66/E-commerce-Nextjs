import Head from 'next/head';
import Sidebar from '../../components/Sidebar';

const chat = () => {
  return (
    <div>
      <Head>
        <title>Chat-app</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Sidebar />
    </div>
  );
};

export default chat;
