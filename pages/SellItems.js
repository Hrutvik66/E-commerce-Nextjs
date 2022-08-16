//Nextjs
import Image from "next/image";

//Hero Icons
import { UploadIcon } from "@heroicons/react/outline";

//React Hooks
import { useEffect, useState } from "react";

//Components
import Navbar from "../components/Navbar";

//firebase
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  auth,
  db,
} from "../lib/firebase";

//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import NavBottom from "../components/NavBottom";
import { onAuthStateChanged } from "firebase/auth";

const SellItems = () => {
  const [data, setData] = useState({
    title: "",
    type: "",
    description: "",
    features: "",
    price: "",
    images: [],
  });

  const [user] = useAuthState(auth);

  const [imageFile, setImageFile] = useState([]);

  const keys = [...Array(5).keys()];

  let promises = [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setImageFile((prev) => [...prev, e.target.files[0]]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (
        data.title === "" ||
        data.type === "" ||
        data.description === "" ||
        data.features === "" ||
        data.price === "" ||
        imageFile.length < 5
      ) {
        alert("Please fill in all fields");
      } else {
        handleFireBaseUpload(e);
        Promise.all(promises).then(() => {
          console.log("All files uploaded");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFireBaseUpload = async (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    if (imageFile.length < 5) {
      console.error("Uplaod all 5 images");
    } else {
      for (var i = 0; i < imageFile.length; i++) {
        const storageRef = ref(storage, `/images/${imageFile[i].name}`);

        const uploadTask = uploadBytesResumable(storageRef, imageFile[i]);
        promises.push(uploadTask);
        //initiates the firebase side uploading
        let progress;
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                console.log("File available at", downloadURL);
                setData((prev) => ({
                  ...prev,
                  images: [...prev.images, downloadURL],
                }));
              }
            );
          }
        );
      }
    }
  };

  useEffect(() => {
    if (data.images.length === 5) {
      setItemData();
    }
  }, [data.images]);

  const setItemData = async () => {
    console.log(data);
    const docRef = await addDoc(collection(db, "items"), {
      title: data.title,
      type: data.type,
      description: data.description,
      features: data.features,
      price: data.price,
      images: data.images,
      user: user.uid,
    });
    handleUser(docRef.id);
  };

  const handleUser = async (id) => {
    const ref = doc(db, "users", user?.uid);
    await updateDoc(ref, {
      sold: arrayUnion(id),
    });
    toast.success("Item added successfully for sale");
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/Login");
    }
  });
  return (
    <div className="p-5 py-[5rem] md:p-[5rem] overflow-y-auto">
      <Head>
        <title>Add To Sell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NavBottom/>
      <div className="flex flex-col space-y-8 border-[1px] rounded border-black h-full p-5">
        <div>
          <h2 className="text-lg font-bold">Sell Items</h2>
        </div>
        <hr className="w-[100%] border-black" />
        <div className="flex flex-col space-y-4">
          <h2 className="font-bold">Include Some Details</h2>
          <div>
            <label htmlFor="item-title" className="sr-only">
              Item Title
            </label>
            <input
              className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md focus:"
              type="input"
              name="title"
              id="item-title"
              required
              placeholder="Enter Title of Item"
              onChange={handleChange}
              value={data.title}
            />
            <span className="text-gray-600 text-xs">
              <b>*</b>Include the full title of the item
            </span>
          </div>
          <select
            name="type"
            defaultValue="--Select Category--"
            onChange={handleChange}
            className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 px-3 w-full focus:outline-none focus:border-violet-600 rounded-md"
          >
            <option value="--Select Category--" disabled>
              Select Category
            </option>
            <option value="Electronic">Electronic</option>
            <option value="Books">Books</option>
            <option value="Instruments">Instruments</option>
          </select>
          <div className="space-y-0">
            <label htmlFor="item-features" className="sr-only">
              Features of Item
            </label>
            <textarea
              className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md focus:"
              name="features"
              id="item-features"
              required
              placeholder="Enter Features of Item"
              onChange={handleChange}
              value={data.features}
            />
            <span className="text-gray-600 text-xs">
              <b>*</b>Include features of item
            </span>
          </div>
          <div>
            <label htmlFor="item-description" className="sr-only">
              Description of Item
            </label>
            <textarea
              className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md focus:"
              name="description"
              id="item-description"
              required
              placeholder="Enter Description of Item"
              onChange={handleChange}
              value={data.description}
            />
            <span className="text-gray-600 text-xs">
              <b>*</b>Include condition and reason for selling
            </span>
          </div>
        </div>
        <hr className="w-[100%] border-black" />
        <div className="flex flex-col space-y-3">
          <h2 className="font-bold">Set Price</h2>
          <div>
            <label htmlFor="item-price" className="sr-only">
              Price
            </label>
            <input
              className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md focus:"
              type="input"
              name="price"
              id="item-price"
              required
              placeholder="Enter price of Item"
              onChange={handleChange}
              value={data.price}
            />
          </div>
        </div>
        <hr className="w-[100%] border-black mt-3" />
        <div className="space-y-3">
          <h2 className="font-bold">Upload Images</h2>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-2">
              <label htmlFor="item-image" className="sr-only">
                Upload Image
              </label>
              <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-x-3 md:space-y-0">
                  {keys.map((item) => (
                    <div
                      className="flex items-center justify-center w-full md:w-[10rem]"
                      key={item}
                    >
                      <label className="flex flex-col w-full h-32 border-4 border-indigo-400 border-dashed hover:bg-gray-100 hover:border-violet-500">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
                          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                            Attach a file
                          </p>
                        </div>
                        <input
                          className="placeholder-gray-400 border-gray-400 border-[1.5px] p-2 w-full focus:outline-none focus:border-violet-600 rounded-md hidden"
                          type="file"
                          name="image"
                          id="item-image"
                          onChange={handleImage}
                        />
                      </label>
                    </div>
                  ))}
                  {/* <Image src={data.images[i]} className="w-[10rem] h-[10rem]" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-700 p-2 rounded-md text-white focus:ring ring-indigo-500 ring-offset-4"
          onClick={handleSubmit}
        >
          Add To Sell
        </button>
      </div>
    </div>
  );
};

export default SellItems;
