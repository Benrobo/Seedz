import Layout, { MobileLayout } from "@/components/Layout";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { CurrencySymbol, genID } from "./api/helper";
import { AiFillEdit } from "react-icons/ai";
import withAuth from "@/helpers/withAuth";
import { ChildBlurModal } from "@/components/Modal";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { AddProductInfoType, AllProductProp } from "../@types";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import { encode } from "blurhash";
import ImageTag, { LazyLoadImg } from "@/components/Image";
import axios from "axios";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { AddProduct, GetAllProducts } from "./http";
import handleApolloHttpErrors from "./http/error";
import StarRating from "@/components/StarRating";
import { BsFillTrashFill } from "react-icons/bs";
import { Blurhash } from "react-blurhash";
import { useAuth } from "@clerk/nextjs";

function Store() {
  const { userId, isLoaded } = useAuth();
  const [addProductModal, setAddProductModal] = React.useState(false);
  const [imgUploading, setImgUploading] = React.useState(false);
  const [previewImg, setPreviewiMG] = React.useState("");
  const [imgData, setImgData] = React.useState({
    url: "",
    hash: "",
    width: 0,
    height: 0,
  });
  const [availableForRent, setAvailableForRent] = React.useState(false);
  const [productInfo, setProductInfo] = React.useState<AddProductInfoType>({
    availableForRent: false,
    category: "",
    description: "",
    name: "",
    price: 0,
    rentingPrice: "",
    quantity: 1,
  });
  const [allProducts, setAllProducts] = React.useState<AllProductProp[]>(
    [] as AllProductProp[]
  );
  const [addProductMutation, addProductMutationProps] = useMutation(
    AddProduct,
    {
      errorPolicy: "all",
    }
  );
  const [getAllProducts, allProductsQuery] = useLazyQuery(GetAllProducts);
  const [productErr, setProductsErr] = React.useState(null);

  const seedzFileInput = React.useRef();

  const toggleProductModal = () => setAddProductModal(!addProductModal);
  const handleFileChange = async () => {
    const formData = new FormData();
    const fileInp = seedzFileInput.current as any;
    const file = fileInp.files[0];

    if (typeof file === "undefined") return;

    formData.append("file", file);
    formData.append("upload_preset", "seedz_media");
    formData.append("cloud_name", "dmi4vivcw");

    // FormData can't be printed with console.log(formData)
    if (
      typeof formData.get("file") === "undefined" ||
      formData.get("file") === null
    ) {
      console.log("No image selected.");
      return;
    }

    try {
      // upload image
      setImgUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmi4vivcw/image/upload",
        formData
      );
      const data = res?.data ?? (res as any)?.response?.data;

      if (typeof data.secure_url !== "undefined") {
        const imgUrl = data.secure_url;
        const imgW = data.width;
        const imgH = data.height;
        setImgData((prev) => ({
          ...prev,
          ["url"]: imgUrl,
          height: imgH,
          width: imgW,
        }));
        setPreviewiMG(imgUrl);
      }
    } catch (e: any) {
      setImgUploading(false);
      const err = e?.response?.data.msg ?? `Image couldn't be uploaded.`;
      console.log(e);
      console.log(err);
      toast.error(err);
    }
  };

  const handleControlInp = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductInfo((prev) => ({ ...prev, [name]: value }));
  };

  //   convert uploaded image to canvas
  const getImageData = (image: any, w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0);
    return context?.getImageData(0, 0, w, h);
  };

  //   save product
  const addProduct = async () => {
    const { category, description, name, price, quantity, rentingPrice } =
      productInfo;

    if (!category || !description || !name || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (availableForRent && rentingPrice.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...productInfo,
      availableForRent,
      rentingPrice: +rentingPrice,
      image: {
        hash: imgData.hash,
        url: imgData.url,
      },
    };

    payload["price"] = +price;
    payload["quantity"] = +quantity;

    addProductMutation({
      variables: {
        productPayload: payload,
      },
    });
  };

  //   reset all form state
  const resetFormState = () => {
    setImgData({
      url: "",
      hash: "",
      width: 0,
      height: 0,
    });
    setProductInfo({
      availableForRent: false,
      category: "",
      description: "",
      name: "",
      price: 0,
      rentingPrice: "",
      quantity: 1,
    });
    setAvailableForRent(false);
    setPreviewiMG("");
  };

  React.useEffect(() => {
    if (previewImg.length > 0) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = previewImg;
      img.onload = () => {
        const imageData = getImageData(
          img,
          imgData.width,
          imgData.height
        ) as any;
        const hash = encode(
          imageData.data,
          imageData.width,
          imageData.height,
          4,
          4
        );
        setImgData((prev) => ({ ...prev, hash: hash }));
        setImgUploading(false);
        console.log({ hash });
      };
    }
  }, [previewImg]);

  React.useEffect(() => {
    addProductMutationProps.reset();
    if (addProductMutationProps.error) {
      handleApolloHttpErrors(addProductMutationProps.error);
    } else if (addProductMutationProps.data?.addProduct?.success) {
      toast.success(addProductMutationProps.data?.addProduct?.msg);
      setAddProductModal(false);
      resetFormState();
      getAllProducts();
    }
  }, [addProductMutationProps.data, addProductMutationProps.error]);

  // all products
  React.useEffect(() => {
    getAllProducts(); // this would fetch all products initially and can also be used to refetch it later on.
  }, []);

  React.useEffect(() => {
    if (allProductsQuery.error) {
      const err = handleApolloHttpErrors(allProductsQuery.error);
      setProductsErr(err);
    } else if (allProductsQuery?.data?.getProducts?.length > 0) {
      const products = allProductsQuery.data?.getProducts;
      console.log(products);
      setAllProducts(products);
    }
  }, [allProductsQuery.data, allProductsQuery.error]);

  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="store" className="h-[100vh] overflow-y-hidden">
        <div className="w-full h-auto flex items-center justify-center px-[1em] py-3 gap-2 ">
          <div className="w-full border-solid border-[2px] border-white2-400 flex items-center justify-start px-[.8em] rounded-lg ">
            <BiSearch size={20} className="text-white-400" />
            <input
              type="text"
              className="w-full bg-transparent px-3 py-2 outline-none ppR"
              placeholder="Search here..."
            />
          </div>
          <button
            className="w-[120px] px-3 py-3 rounded-md text-[12px] bg-green-600 N-B text-white-100 flex items-center justify-center transition-all opacity-[.8] hover:opacity-[1] "
            onClick={toggleProductModal}
          >
            Add Item
          </button>
        </div>
        <div className="w-full h-[100vh] flex flex-wrap items-start justify-between gap-3 px-[.4em] mt-5 overflow-y-auto">
          {allProductsQuery.loading === false && productErr !== null && (
            <div className="w-full h-full mt-[4em] flex flex-col items-center justify-center">
              <p className="text-dark-200 N-B">An Error Occured</p>
              <p className="text-white-400 ppR text-[13px] ">
                {productErr ?? "Something went wrong"}. please try again later
              </p>
            </div>
          )}
          {allProductsQuery.loading && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Spinner color="#000" />
            </div>
          )}
          {allProductsQuery.loading === false && isLoaded ? (
            allProducts.length > 0 ? (
              allProducts.map((d) => (
                <ItemCard
                  key={d?.id}
                  id={d.id}
                  imgUrl={d?.image?.url}
                  hash={d?.image?.hash}
                  name={d?.name}
                  price={d?.price}
                  ratings={d?.ratings?.rate}
                  userId={(d as any)?.user?.id}
                  authUserId={userId as string}
                />
              ))
            ) : (
              <div className="w-full h-full mt-[4em] flex flex-col items-center justify-center">
                <p className="text-dark-200 N-B">No Products Listed</p>
                <p className="text-white-400 ppR text-[13px] ">
                  be the first to sell your product to customers.
                </p>
              </div>
            )
          ) : null}
          {/* Gap */}
          <div className="w-full h-[200px] md:h-[200px] "></div>
        </div>

        {/* Selected Product Modal */}

        {/* Add Item Modal */}
        <ChildBlurModal
          isBlurBg
          isOpen={addProductModal}
          className="bg-white-105 items-start"
        >
          {/* Upload Image Loading Modal */}
          {imgUploading || addProductMutationProps.loading ? (
            <ChildBlurModal isOpen isBlurBg>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner color="#000" />
                <span className="text-[14px] mt-2 text-dark-100 N-B">
                  {addProductMutationProps.loading ? "" : "Uploading image..."}
                </span>
              </div>
            </ChildBlurModal>
          ) : null}

          <div className="w-full h-[100vh] flex flex-col items-start justify-start py-4">
            <div className="w-full flex flex-col items-start justify-start border-b-solid border-b-[.5px] border-b-white2-300 px-[1em] py-2 ">
              <p className="text-dark-100 ppM flex items-center justify-center gap-2">
                <button
                  className="w-auto rounded-md text-[12px] bg-none N-B text-dark-100 flex items-center justify-start "
                  onClick={toggleProductModal}
                >
                  <FaLongArrowAltLeft size={20} />
                </button>
                Add new product
              </p>
              <p className="ppR text-white-400 text-[13px] ">
                Add product to seedz market place
              </p>
            </div>

            {/* Product component */}
            <div className="w-full flex flex-col items-start justify-start px-[1em] py-2 mt-3 ">
              <div className="w-full flex flex-col items-start justify-start">
                <p className="text-dark-400 text-[14px] ppR flex items-center justify-center gap-2">
                  Add new product image.
                </p>
                <div className="w-full mt-2 flex items-center justify-start gap-5">
                  <div className="w-[80px] h-[70px] max-w-[70px] rounded-md bg-white-400">
                    {imgData.hash.length > 0 && (
                      <LazyLoadImg
                        alt="product_image"
                        src={imgData.url}
                        hash={imgData.hash}
                        className="w-[80px] h-[70px] rounded-md bg-white-400"
                      />
                    )}
                  </div>
                  <button
                    className="w-[80px] h-[70px] px-3 py-1 rounded-md text-[12px] bg-none border-dashed border-[2px] border-white2-700 N-B text-white-100 flex items-center justify-center transition-all opacity-[.8] hover:opacity-[1] "
                    id="seedz_file_inp_act"
                    onClick={() => (seedzFileInput.current as any).click()}
                  >
                    <IoMdAdd size={20} className="text-dark-100" />
                  </button>

                  {/* hidden file */}
                  <input
                    type="file"
                    id="seedz_file_inp"
                    hidden
                    className=" fixed top-0 right-[-4em] "
                    onChange={handleFileChange}
                    onClick={(e) => ((e.target as any).value = null)} // fire onchange event if same file where selected.
                    ref={seedzFileInput as any}
                  />
                </div>

                <br />
                <p className="text-dark-400 text-[14px] ppM flex items-center justify-center gap-2">
                  Enter product details
                </p>
                <div className="w-full h-full mt-5 flex flex-col items-start justify-start gap-9">
                  <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                      Select product category
                    </p>
                    <select
                      name="category"
                      id=""
                      className="w-full mt-2 text-[14px] text-dark-400 bg-white2-300 px-3 py-2 rounded-md ppR"
                      onChange={handleControlInp}
                    >
                      <option value="">select category</option>
                      <option
                        value="FARM_PRODUCE"
                        defaultValue={
                          productInfo.category === "FARM_PRODUCE"
                            ? "FARM_PRODUCE"
                            : ""
                        }
                      >
                        Farm Produce
                      </option>
                      <option
                        value="FARM_MACHINERY"
                        defaultValue={
                          productInfo.category === "FARM_MACHINERY"
                            ? "FARM_MACHINERY"
                            : ""
                        }
                      >
                        Farm Machinery
                      </option>
                    </select>
                  </div>
                  <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                      Product name
                    </p>
                    <input
                      type="text"
                      name="name"
                      className="w-full bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                      placeholder="Product name"
                      onChange={handleControlInp}
                      defaultValue={productInfo.name}
                    />
                  </div>

                  {/* Only user with role SUPPLIER & BUYER */}
                  <div className="w-full flex items-start justify-between gap-3">
                    <div className="w-auto flex flex-col items-start justify-start">
                      <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                        Product price
                      </p>
                      <input
                        type="number"
                        className="w-[100px] mt-2 bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                        placeholder="200"
                        name="price"
                        onChange={handleControlInp}
                        defaultValue={productInfo.price}
                      />
                    </div>
                    <div className="w-auto flex flex-col items-start justify-start">
                      <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                        Quantity
                      </p>
                      <input
                        type="number"
                        className="w-[100px] mt-2 bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                        placeholder="200"
                        name="quantity"
                        onChange={handleControlInp}
                        defaultValue={productInfo.quantity}
                      />
                    </div>
                    <div className="w-auto flex flex-col items-start justify-start">
                      <p className="text-white-400 text-[14px] ppM flex items-center justify-between gap-2">
                        Available for rent
                        <input
                          type="checkbox"
                          name=""
                          className="ml-3"
                          onChange={(e) =>
                            setAvailableForRent(e.target.checked)
                          }
                          checked={availableForRent}
                        />
                      </p>
                      <input
                        type="number"
                        className="w-full mt-2 bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                        placeholder="rent price"
                        name="rentingPrice"
                        style={{
                          visibility: availableForRent ? "visible" : "hidden",
                        }}
                        onChange={handleControlInp}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                      Product description
                    </p>
                    <textarea
                      rows={3}
                      cols={3}
                      className="w-full bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                      placeholder="Product name"
                      name="description"
                      onChange={handleControlInp}
                      defaultValue={productInfo.description}
                    ></textarea>
                  </div>
                  <button
                    className="w-full mb-5 md:mb-0 px-3 py-3 rounded-md text-[12px] bg-green-600 N-B text-white-100 flex items-center justify-center transition-all "
                    onClick={addProduct}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ChildBlurModal>
      </MobileLayout>
    </Layout>
  );
}

export default withAuth(Store);

interface ItemCardProps {
  name: string;
  ratings: number[];
  price: number;
  id: string;
  hash: string;
  imgUrl: string;
  userId: string;
  authUserId: string;
}

function ItemCard({
  name,
  ratings,
  price,
  id,
  userId,
  authUserId,
  hash,
  imgUrl,
}: ItemCardProps) {
  const avgRating =
    ratings?.length > 0
      ? (
          ratings.reduce((acc, rate) => (acc += rate), 0) / ratings.length
        ).toFixed(2)
      : 0;
  const isOwner = userId === authUserId;

  return (
    <div className="w-full max-w-[150px] h-auto flex flex-col items-center justify-center rounded-md overflow-hidden ">
      <button className="w-full h-[150px] border-none outline-none bg-gray-300 cursor-pointer rounded-md ">
        {hash?.length > 0 && (
          <LazyLoadImg
            alt="product_image"
            src={imgUrl}
            hash={hash}
            className="w-full h-full object-cover rounded-md bg-white-400"
          />
        )}
      </button>
      {/*  */}
      <div className="w-full flex flex-col items-start justify-start py-3 px-3">
        <div className="w-full flex items-center justify-between ">
          <p className="text-dark-100 N-B text-[14px] ">{name}</p>
          <div className="w-auto flex items-center justify-center">
            <p className="w-auto flex items-center justify-center">
              <span className="ppR text-[12px] mr-2 ">{avgRating}</span>
            </p>
            <StarRating averageRating={+avgRating} />
          </div>
        </div>
        <div className="w-full flex items-center justify-between mt-5">
          <p className="ppM  text-[15px] ">
            <span className="text-white-400">{CurrencySymbol.NGN}</span>
            <span className="text-dark-100 N-B">{price}</span>
          </p>
          {isOwner && (
            <button className="w-auto rounded-md bg-orange-600 N-B text-white-100 flex items-center justify-center transition-all opacity-[.9] hover:opacity-[1] ">
              <BsFillTrashFill size={30} className="p-[8px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
