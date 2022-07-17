import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="">
      <Head>
        <title>Brocher</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar/>
      </main>
    </div>
  )
}

export default Home
