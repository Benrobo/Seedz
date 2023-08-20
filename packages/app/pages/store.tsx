import Layout, { MobileLayout } from "@/components/Layout";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { CurrencySymbol } from "./api/helper";
import { AiFillEdit } from "react-icons/ai";
import withAuth from "@/helpers/withAuth";
import { ChildBlurModal } from "@/components/Modal";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

function Store() {
  const [addProductModal, setAddProductModal] = React.useState(false);
  const [addProductInfo, setAddProductInfo] = React.useState();

  const toggleProductModal = () => setAddProductModal(!addProductModal);

  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="store">
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
        <div className="w-full flex flex-wrap items-center justify-between gap-3 px-[1em] mt-5 ">
          <ItemCard />
        </div>
        {/* Add Item Modal */}

        <ChildBlurModal
          isBlurBg
          isOpen={addProductModal}
          className="bg-white-105 items-start"
        >
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
                  <div className="w-[80px] h-[70px] rounded-md bg-white-400 "></div>
                  <button className="w-[80px] h-[70px] px-3 py-1 rounded-md text-[12px] bg-none border-dashed border-[2px] border-white2-700 N-B text-white-100 flex items-center justify-center transition-all opacity-[.8] hover:opacity-[1] ">
                    <IoMdAdd size={20} className="text-dark-100" />
                  </button>
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
                      name=""
                      id=""
                      className="w-full mt-2 text-[14px] text-dark-400 bg-white2-300 px-3 py-2 rounded-md ppR"
                    >
                      <option value="">select category</option>
                      <option value="farm_produce">Farm Produce</option>
                      <option value="farm_machinery">Farm Machinery</option>
                    </select>
                  </div>
                  <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                      Product name
                    </p>
                    <input
                      type="text"
                      className="w-full bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                      placeholder="Product name"
                    />
                  </div>

                  {/* Only user with role SUPPLIER */}
                  <div className="w-full flex items-start justify-between gap-3">
                    <div className="w-auto flex flex-col items-start justify-start">
                      <p className="text-white-400 text-[14px] ppM flex items-center justify-center gap-2">
                        Product price
                      </p>
                      <input
                        type="number"
                        className="w-[100px] mt-2 bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                        placeholder="200"
                      />
                    </div>
                    <div className="w-auto flex flex-col items-start justify-start">
                      <p className="text-white-400 text-[14px] ppM flex items-center justify-between gap-2">
                        Available for rent
                        <input type="checkbox" name="" className="ml-3" />
                      </p>
                      <input
                        type="number"
                        className="w-full mt-2 bg-white2-300 border-solid border-[.5px] border-white-400 text-[14px] rounded-md px-3 py-2 outline-none ppR"
                        placeholder="rent price"
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
                    ></textarea>
                  </div>
                  <button className="w-full mb-5 px-3 py-3 rounded-md text-[12px] bg-green-600 N-B text-white-100 flex items-center justify-center transition-all ">
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

function ItemCard() {
  return (
    <div className="w-full max-w-[200px] bg-white-100 shadow-md flex flex-col items-center justify-center rounded-md overflow-hidden">
      <div className="w-full h-[120px] bg-gray-400 "></div>
      <div className="w-full flex flex-col items-start justify-start py-3 px-3">
        <p className="text-dark-100 N-B text-[20px] ">Mango</p>
        <div className="w-full flex items-center justify-between mt-5">
          <p className="ppM  text-[15px] ">
            <span className="text-white-400">{CurrencySymbol.NGN}</span>
            <span className="text-dark-100 N-B">{100}</span>
          </p>
          <button className="w-auto px-3  py-2 rounded-md text-[12px] bg-green-600 N-B text-white-100 flex items-center justify-center transition-all opacity-[.9] hover:opacity-[1] ">
            <AiFillEdit size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
