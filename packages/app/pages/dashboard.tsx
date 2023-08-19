import BlurBgRadial from "@/components/BlurBgRadial";
import BottomNav from "@/components/BottomNav";
import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import withAuth from "@/helpers/withAuth";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { BsBank2 } from "react-icons/bs";
import { FaTemperatureHigh } from "react-icons/fa";
import { IoAddOutline, IoCashOutline } from "react-icons/io5";
import { MdDoubleArrow } from "react-icons/md";

function Dashboard() {
  const [walletTopup, setWalletTopup] = React.useState(false);

  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="home">
        <div className="w-full h-[100vh] relative bg-white-100 flex flex-col items-center justify-start overflow-x-hidden ">
          <div className="w-full h-[650px] relative overflow-hidden bg-dark-100 before:content-[''] before:absolute before:top-[-10em] before:left-[5em] before:w-[60%] before:h-[100vh] before:bg-dark-200 before:rotate-[120deg] flex items-start justify-start ">
            <div className="w-full z-[1] flex items-start justify-between px-[2em] px-md:[3em] mt-[4em] ">
              <div className="w-full flex flex-col items-start justify-start">
                <h1 className="N-EB text-white-200 text-3xl max-w-[250px] ">
                  Welcome To Seedz,{" "}
                  <span className="text-white-100">Benaiah</span>
                </h1>
                <p className="N-M text-white-300 text-[15px] max-w-[250px] ">
                  Empowering Farmers, Enhancing Productivity
                </p>
              </div>
              <div className="w-auto flex flex-col items-end justify-end">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>

            {/* mini weather info */}
            <div className="w-full px-3 py-2 absolute bottom-[4.4em] right-0 flex items-center justify-end gap-5">
              <div className="flex items-center justify-start gap-1">
                <FaTemperatureHigh className="text-green-600" />
                <span className="N-B text-[14px] text-white-100">20</span>
              </div>
              <div className="flex items-center justify-start gap-1">
                <BiCurrentLocation className="text-red-300" />
                <span className="N-B text-[14px] text-white-100">
                  Lagos, Nigeria
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="w-full relative z-[100] top-[-3.5em]  flex flex-col items-center justify-center px-[3.5em]  ">
            {/* style needed to add a mini box uder the div */}
            {/* before:content-[''] before:w-[70%] before:h-[100px] before:z-[-5] before:absolute before:bottom-[-.7em] before:mx-auto before:bg-green-300 before:shadow-sm before:rounded-[20px] */}
            <div className="w-full z-[2] relative flex flex-col items-center justify-center bg-white-100 shadow-lg rounded-[10px] py-5 ">
              <p className="text-white-400 ppR text-[14px]">
                Available Balance
              </p>
              <h1 className="N-EB text-4xl mt-4 text-dark-100">$900.00</h1>
              <div className="w-full px-[2em] flex items-center justify-between mt-4">
                <button
                  className="px-6 py-3 rounded-[30px] flex items-center justify-between bg-green-600 text-white-100 ppR"
                  onClick={() => setWalletTopup(!walletTopup)}
                >
                  <span className="text-[12px] N-B ">Add Money</span>{" "}
                  <IoAddOutline className="ml-2 text-white-100" />
                </button>
                <button className="px-6 py-3 rounded-[30px] flex items-center justify-between bg-green-600 text-white-100 ppR">
                  <span className="text-[12px] N-B ">Withdraw</span>{" "}
                  <BsBank2 className="ml-2 text-white-100" />
                </button>
              </div>
            </div>
          </div>

          <main className="w-full h-full z-[100] max-h-full hideScrollBar overflow-y-scroll ">
            {/* some other component here */}
          </main>
        </div>

        {/* Top up modal */}
        <ChildBlurModal
          isBlurBg
          isOpen={walletTopup}
          showCloseIcon
          onClose={() => setWalletTopup(false)}
          className="bg-white-600"
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full px-[4em] flex flex-col items-center justify-center ">
              <p className="text-white-400 ppR text-[12px] mb-2">Amount</p>
              <h1 className="text-dark-100 N-EB text-5xl">$100</h1>
            </div>
            <br />
            <div className="px-10 max-w-[400px] flex flex-col items-center justify-center">
              <div className="w-full bg-dark-200 border-[2px] border-solid border-dark-100 flex items-start justify-start rounded-r-[5px] rounded-t-[5px]">
                <input
                  type="number"
                  className="w-full text-center h-[45px] border-none outline-none rounded-none text-dark-100 N-B text-2xl px-4 py-3 "
                />
                <button className="w-[70px] h-[45px] flex flex-col items-center justify-center text-white-100 bg-dark-300 N-B rounded-r-[10px] rounded-t-[10px] ">
                  <IoCashOutline size={20} />
                </button>
              </div>

              <br />
              <button className="w-full px-6 py-4 rounded-[5px] flex items-center justify-center bg-green-700 text-white-100 ppR">
                <span className="text-[14px] N-B ">Continue</span>{" "}
                <MdDoubleArrow className="ml-2 text-white-100" />
              </button>
            </div>
          </div>
        </ChildBlurModal>
      </MobileLayout>
    </Layout>
  );
}

export default withAuth(Dashboard);
