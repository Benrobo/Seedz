import BlurBgRadial from "@/components/BlurBgRadial";
import BottomNav from "@/components/BottomNav";
import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import withAuth from "@/helpers/withAuth";
import { UserButton, useAuth } from "@clerk/nextjs";
import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { BsBank2 } from "react-icons/bs";
import { FaTemperatureHigh } from "react-icons/fa";
import { IoAddOutline, IoCashOutline } from "react-icons/io5";
import { MdDoubleArrow, MdVerified } from "react-icons/md";
import { formatCurrency, formatNumLocale } from "./api/helper";
import { useMutation, useQuery } from "@apollo/client";
import { FundWallet, GetUserInfo } from "./http";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import { UserType } from "../@types";
import handleApolloHttpErrors from "./http/error";
import useIsRendered from "@/helpers/useIsRendered";
import Assistant from "@/components/Assistant";

function Dashboard() {
  const { userId } = useAuth();
  const hasRendered = useIsRendered();
  const [walletTopup, setWalletTopup] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState(0);
  const [fundWallet, { loading, error, data, reset }] = useMutation(FundWallet);
  const userQuery = useQuery(GetUserInfo, {
    variables: {
      userId: userId,
    },
    skip: hasRendered ? false : true, // if true, it wont be called.
    // skip: hasRendered, // if true, it wont be called.
  });
  const [userInfo, setUserInfo] = React.useState<UserType>({} as UserType);
  const [assistantModal, setAssistantModal] = React.useState(false);

  const MAX_FUND_AMOUNT = 500;

  const creditWallet = () => {
    if (topUpAmount < MAX_FUND_AMOUNT) {
      toast.error(`amount can't be less than ${MAX_FUND_AMOUNT}`);
      return;
    }
    fundWallet({
      variables: {
        amount: topUpAmount,
        currency: "NGN",
      },
    });
  };

  const rolebadgeColor = (role: string) => {
    if (role === "SUPPLIER") return "#15eb80";
    if (role === "BUYER") return "#ff8500";
    if (role === "MERCHANT") return "#4055e4";
  };

  // fundwallet mutation
  React.useEffect(() => {
    reset();
    if (error) {
      // console.log(data);
      handleApolloHttpErrors(error);
    } else if (typeof data?.fundWallet.authorization_url !== "undefined") {
      toast.success("Payment Link Created");
      window.open(data.fundWallet.authorization_url, "_blank");
      setWalletTopup(false);
      setTopUpAmount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  // fetch user info
  React.useEffect(() => {
    if (userQuery.error) {
      // console.log(data);
      handleApolloHttpErrors(userQuery.error);
    } else if (typeof userQuery.data?.getUser?.email !== "undefined") {
      const info = userQuery.data?.getUser;
      localStorage.setItem(
        "@userInfo",
        JSON.stringify({
          email: info.email,
          username: info.username,
          fullname: info.fullname,
          role: info.role,
          image: info.image,
        })
      );
      setUserInfo(info);
    }
  }, [userQuery.data, userQuery.error]);

  // show a blur modal initially

  return (
    <Layout className="bg-white-105 overflow-y-hidden">
      <MobileLayout activePage="dashboard" className="overflow-hidden">
        {!hasRendered || userQuery.loading === true ? (
          <ChildBlurModal isBlurBg isOpen={true}>
            <div className="w-full flex flex-col items-center justify-center">
              <Spinner color="#012922" />
            </div>
          </ChildBlurModal>
        ) : null}
        <div className="w-full h-[100vh] relative bg-white-100 flex flex-col items-center justify-start overflow-x-hidden ">
          <div className="w-full h-[650px] relative overflow-hidden bg-dark-100 before:content-[''] before:absolute before:top-[-10em] before:left-[5em] before:w-[60%] before:h-[100vh] before:bg-dark-200 before:rotate-[120deg] flex items-start justify-start ">
            <div className="w-full z-[1] flex items-start justify-between px-[2em] px-md:[3em] mt-[4em] ">
              <div className="w-full flex flex-col items-start justify-start">
                <h1 className="N-EB text-white-200 text-[28px] max-w-[250px] ">
                  Welcome,{" "}
                  <span className="text-white-100">
                    {userInfo.fullname ?? ""}
                  </span>
                </h1>
                <p className="N-M text-white-300 text-[13px] max-w-[250px] ">
                  Empowering Farmers, Enhancing Productivity
                </p>
              </div>
              <div className="w-auto flex flex-col items-end justify-end">
                <UserButton afterSignOutUrl="/" />
                <div className="w-full flex items-center mt-3 justify-center">
                  <MdVerified color={rolebadgeColor(userInfo.role)} />
                  <span className="text-white-300 px-2 py-1 flex items-center justify-center rounded-[30px] bg-dark-300 N-B text-[10px] ml-2 ">
                    {userInfo.role}
                  </span>
                </div>
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
              <h1 className="N-EB text-4xl mt-4 text-dark-100">
                {formatCurrency(+userInfo?.wallet?.balance ?? 0, "NGN")}
              </h1>
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

          <main className="w-full h-full z-[100] max-h-full hideScrollBar overflow-y-hidden ">
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
              <h1 className="text-green-705 N-EB text-5xl">
                {formatCurrency(+topUpAmount, "NGN")}
              </h1>
            </div>
            <br />
            <div className="px-10 max-w-[400px] flex flex-col items-center justify-center">
              <div className="w-full bg-dark-200 border-[2px] border-solid border-dark-100 flex items-start justify-start rounded-r-[5px] rounded-t-[5px]">
                <input
                  type="number"
                  className="w-full text-center h-[45px] border-none outline-none rounded-none text-dark-100 N-B text-2xl px-4 py-3 "
                  onChange={(e: any) => setTopUpAmount(e.target.value)}
                  disabled={loading}
                />
                <button className="w-[70px] h-[45px] flex flex-col items-center justify-center text-white-100 bg-dark-300 N-B rounded-r-[10px] rounded-t-[10px] ">
                  <IoCashOutline size={20} />
                </button>
              </div>

              <br />
              <button
                className="w-full px-6 py-4 rounded-[5px] flex items-center justify-center bg-green-700 text-white-100 ppR"
                onClick={creditWallet}
              >
                {loading ? (
                  <Spinner color="#fff" />
                ) : (
                  <>
                    <span className="text-[14px] N-B ">Continue</span>{" "}
                    <MdDoubleArrow className="ml-2 text-white-100" />
                  </>
                )}
              </button>
            </div>
          </div>
        </ChildBlurModal>

        {/* Assistance */}
        <Assistant
          isOpen={assistantModal}
          openAssistant={() => setAssistantModal(true)}
          closeAssistantModal={() => setAssistantModal(false)}
        />
      </MobileLayout>
    </Layout>
  );
}

export default withAuth(Dashboard);
