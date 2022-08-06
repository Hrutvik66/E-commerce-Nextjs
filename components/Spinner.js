import Head from "next/head";

const Spinner = () => {
  return (
    <div className="border-[5px] z-100 absolute top-20 left-[50%] inset-y-[20px] h-[50px] w-[50px] animate-spin rounded-full border-solid border-black border-t-[5px] border-t-white">
      <Head>
        <title>Loading...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Spinner;
