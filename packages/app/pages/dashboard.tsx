import BlurBgRadial from "@/components/BlurBgRadial";
import BottomNav from "@/components/BottomNav";
import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import withAuth from "@/helpers/withAuth";
import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { BsBank2, BsFillCloudLightningRainFill } from "react-icons/bs";
import { FaTemperatureHigh } from "react-icons/fa";
import { IoAddOutline, IoCashOutline } from "react-icons/io5";
import { MdDoubleArrow, MdVerified } from "react-icons/md";
import { formatCurrency, formatNumLocale } from "./api/helper";
import { useMutation, useQuery } from "@apollo/client";
import { CreateNewUser, FundWallet, GetUserInfo } from "../http";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import { UserType } from "../@types";
import handleApolloHttpErrors from "../http/error";
import useIsRendered from "@/helpers/useIsRendered";
import Assistant from "@/components/Assistant";
import useWeather from "@/helpers/useWeather";
import moment from "moment";
import ImageTag from "@/components/Image";
import useAuth from "@/helpers/useIsAuth";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Passage } from "@passageidentity/passage-js";
import { IoIosLogOut } from "react-icons/io";
import ENV from "./api/config/env";

const passage = new Passage(ENV.passageAppId);
const passageUser = passage.getCurrentUser();

function Dashboard() {
  const seedzUseAuth = useAuth();
  const hasRendered = useIsRendered(5);
  const [walletTopup, setWalletTopup] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState(0);
  const [userCreateModal, setUserCreateModal] = React.useState(false);
  const [fundWallet, { loading, error, data, reset }] = useMutation(FundWallet);
  const userQuery = useQuery(GetUserInfo);
  const [createUsetMut, createUserMutProps] = useMutation(CreateNewUser);
  const [userInfo, setUserInfo] = React.useState<UserType>({} as UserType);
  const [assistantModal, setAssistantModal] = React.useState(false);
  const {
    getGeolocation,
    getWeatherByLocation,
    loading: weatherLoading,
    weatherInfo,
  } = useWeather();
  const [passageUserLoading, setPassageUserLoading] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);

  const MIN_FUND_AMOUNT = 500;

  const creditWallet = () => {
    if (topUpAmount < MIN_FUND_AMOUNT) {
      toast.error(`amount can't be less than ${MIN_FUND_AMOUNT}`);
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

  React.useEffect(() => {
    if (hasRendered) {
      // const hasRoleUpdated =
      //   localStorage.getItem("@hasRoleUpdated") === null
      //     ? null
      //     : JSON.parse(localStorage.getItem("@hasRoleUpdated") as string);
      // if (hasRoleUpdated === null) {
      //   // updateRole();
      // } else {
      //   // setHasRoleUpdated(hasRoleUpdated);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRendered]);

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
      const networkError = userQuery.error.networkError as any;
      const errorObj =
        networkError?.result?.errors[0] ?? userQuery.error.graphQLErrors[0];
      if (errorObj.code === "NO_USER_FOUND") {
        setUserCreateModal(true);
      } else {
        handleApolloHttpErrors(userQuery.error);
      }
    } else if (typeof userQuery.data?.getUser?.email !== "undefined") {
      const info = userQuery.data?.getUser;
      localStorage.setItem(
        "@userInfo",
        JSON.stringify({
          id: info?.id,
          email: info.email,
          username: info.username,
          fullname: info.fullname,
          role: info.role,
          image: info.image,
        })
      );
      setUserInfo(info);
      setUserCreateModal(false);
    } else {
      // noi user data available
      const info = userQuery.data?.getUser;
      if (info === null) {
        setUserCreateModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data, userQuery.error]);

  // creatingf of user
  React.useEffect(() => {
    createUserMutProps.reset();
    if (createUserMutProps.error) {
      handleApolloHttpErrors(createUserMutProps?.error);
    } else if (createUserMutProps.data?.createUser?.success) {
      console.log(createUserMutProps.data);
      toast.success("Changes Saved");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserMutProps.data, createUserMutProps.error]);

  async function createUser(role: string) {
    setPassageUserLoading(true);
    const userInfo = await passageUser.userInfo();
    if (userInfo) {
      setPassageUserLoading(false);
      const { email, user_metadata } = userInfo;
      const payload = {
        email,
        username: user_metadata?.username,
        fullname: user_metadata?.fullname,
        role,
      };

      if (role.length === 0) {
        toast.error("Please select a role.");
        return;
      }

      setUserCreateModal(false);
      createUsetMut({
        variables: { payload },
      });
    }
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <Layout className="bg-white-105 overflow-y-hidden">
      <MobileLayout activePage="dashboard" className="overflow-hidden">
        {!hasRendered ||
        userQuery.loading === true ||
        createUserMutProps.loading ? (
          <ChildBlurModal isBlurBg isOpen={true}>
            <div className="w-full flex flex-col items-center justify-center">
              <Spinner color="#012922" />
            </div>
          </ChildBlurModal>
        ) : null}

        {/* Modal meant t o create user first time before refetching */}
        {userCreateModal && (
          <CreateNewUserModal
            psgUserLoading={passageUserLoading}
            createUser={createUser}
          />
        )}

        <div className="w-full h-[100vh] relative bg-white-100 flex flex-col items-center justify-start overflow-x-hidden ">
          <div className="w-full h-[650px] relative overflow-hidden bg-dark-100 before:content-[''] before:absolute before:top-[-10em] before:left-[5em] before:w-[60%] before:h-[100vh] before:bg-dark-200 before:rotate-[120deg] flex items-start justify-start ">
            <div className="w-full z-[1] flex items-start justify-between px-[1.5em] md:px-[3em] mt-[4em] ">
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
              <div className="w-auto relative flex flex-col items-center justify-center">
                <button
                  className="w-[40px] h-[40px] bg-dark2-300 p-1 rounded-[50%] border-solid border-[3px] hover:scale-[.85] border-green-600 scale-[.80] transition-all"
                  onClick={() => setLogoutModal(!logoutModal)}
                >
                  <ImageTag alt="user image" src={userInfo?.image} />
                </button>
                <div className="w-full flex items-center mt-3 justify-center">
                  <MdVerified color={rolebadgeColor(userInfo.role)} />
                  <span className="text-white-300 px-2 py-1 flex items-center justify-center rounded-[30px] bg-dark-300 N-B text-[10px] ml-2 ">
                    {userInfo.role}
                  </span>
                </div>

                {/* Logout modal */}
                <div
                  className={`w-full h-auto min-w-[250px] rounded-lg absolute ${
                    logoutModal ? "top-[-2em]" : "top-[-20em]"
                  } right-[4em] bg-white-100 flex flex-col shadow-xl py-2 px-3 z-[1200] transition-all `}
                >
                  <div className="w-full flex items-start justify-start">
                    <button className="w-[40px] h-[40px] bg-dark2-300 p-1 rounded-[50%] border-green-600 transition-all">
                      <ImageTag
                        alt="user image"
                        className="w-full"
                        src={userInfo?.image}
                      />
                    </button>
                    <div className="w-auto px-2 flex flex-col items-start justify-">
                      <p className="text-dark-200 text-[13px] N-B">
                        {userInfo?.fullname}
                      </p>
                      <p className="text-white-400 text-[10px] ppR">
                        {userInfo?.email}
                      </p>
                    </div>
                  </div>
                  <br />
                  <div className="w-full flex flex-col items-center justify-center mb-3">
                    <button
                      className="px-3 py-2 w-full bg-none hover:bg-white-300 rounded-md flex items-center justify-start text-[12px] N-B gap-4 "
                      onClick={logout}
                    >
                      <IoIosLogOut size={20} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="w-full relative z-[100] top-[-3.5em]  flex flex-col items-center justify-center px-[1.3em] md:px-[3.5em]  ">
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
                <button
                  className="px-6 py-3 rounded-[30px] flex items-center justify-between bg-green-600 text-white-100 ppR"
                  onClick={() => {
                    toast("Coming Soon!", {
                      icon: "🚀",
                      style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                      },
                    });
                  }}
                >
                  <span className="text-[12px] N-B ">Withdraw</span>{" "}
                  <BsBank2 className="ml-2 text-white-100" />
                </button>
              </div>
            </div>
          </div>

          <main className="w-full h-full z-[100] max-h-full hideScrollBar overflow-y-hidden flex flex-col items-center justify-start px-[1.3em] md:px-[3.5em] ">
            {/* some other component here */}
            <div className="w-full h-auto shadow-md rounded-md bg-dark-100 p-7 overflow-hidden relative before:content-[''] before:absolute before:top-[-10em] before:left-[5em] before:w-[60%] before:h-[100vh] before:bg-dark-200 before:rotate-[120deg]">
              <div className="w-full flex items-center justify-between">
                <h1 className="N-B text-[15px] z-[1] text-white-100 ">
                  Today :- {weatherInfo?.description}
                </h1>
                <h1 className="ppR text-[10px] text-white-200 z-[1] ">
                  {moment(Date.now()).format("MMM Do YY")}
                </h1>
              </div>
              <div className="w-full mt-5 flex items-center justify-between">
                <h1 className="N-B text-5xl md:text-6xl z-[1] text-green-600 flex items-start justify-start gap-2">
                  {weatherInfo?.temperature ?? 0}{" "}
                  <span className="text-orange-300 text-4xl  ">&#x2103;</span>
                </h1>
                <div className="w-full flex flex-col items-center justify-center">
                  <ImageTag
                    src={
                      weatherInfo?.icon ??
                      "https://openweathermap.org/img/wn/04n@2x.png"
                    }
                    className="shadow-lg w-[70px] scale-[2] animate-pulse"
                    alt="weather icon"
                  />
                </div>
              </div>

              {weatherLoading && (
                <div className="w-full h-full absolute top-0 left-0 backdrop-blur bg-white-500 bg-opacity-75 z-[10] "></div>
              )}
            </div>
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

        {/* Logout Modal */}

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

interface CreateNewUserProps {
  createUser: (role: string) => void;
  psgUserLoading: boolean;
}

function CreateNewUserModal({
  createUser,
  psgUserLoading,
}: CreateNewUserProps) {
  const [role, setRole] = React.useState("");

  const validRoles = [
    { name: "Merchant", icon: "💼", role: "MERCHANT" },
    { name: "Buyer", icon: "🛍️", role: "BUYER" },
    { name: "Supplier", icon: "📦", role: "SUPPLIER" },
  ];

  const selectedRoles = (name: string) => {
    const filteredRole = validRoles.filter((role) => role.name === name)[0];
    if (filteredRole.role === role) setRole("");
    if (filteredRole.role !== role) setRole(filteredRole.role);
  };

  return (
    <ChildBlurModal isBlurBg isOpen={true} className="bg-green-600">
      <div className="w-full h-[100vh] max-w-[500px] flex flex-col items-center justify-center">
        <div className="w-full h-auto flex items-center justify-center">
          <div className="w-auto flex items-center justify-center">
            <Link href="/">
              <ImageTag
                src="/assets/img/logo/leaf-logo.svg"
                className="w-[70px] h-[70px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
                alt="seedz"
              />
            </Link>
            <span className="N-EB text-[30px] text-white-100">Seedz</span>
          </div>
        </div>
        <br />
        <br />
        <div className="w-full max-w-[450px] h-[400px] flex-wrap px-[2em] py-[3em] flex items-center justify-center gap-2 rounded-md">
          <div className="w-full flex flex-col items-center text-center">
            <p className="text-white-100 N-B ">What your Role?</p>
          </div>
          {validRoles.map((d) => (
            <button
              onClick={() => selectedRoles(d.name)}
              key={d.name}
              className={twMerge(
                "w-[120px] bg-white-100 scale-[.70] shadow-2xl px-5 py-5 rounded-lg flex flex-col items-center justify-center border-[5px] border-transparent ",
                d.role === role && "border-solid border-[5px] border-dark-100 "
              )}
            >
              <span className="text-3xl ">{d.icon}</span>
              <p className="text-green-700 text-1xl mt-2 N-EB ">{d.name}</p>
            </button>
          ))}
          <div className="w-full mt-5 flex flex-col items-center justify-center px-[4em] ">
            <button
              className="w-auto bg-green-600 text-white-100 shadow-2xl px-8 py-2 text-[14px] N-B rounded-[30px] flex flex-col items-center justify-center hover:bg-dark-100 hover:border-green-600 border-solid border-[3px] border-transparent transition-all"
              onClick={() => {
                createUser(role);
              }}
            >
              {psgUserLoading ? <Spinner color="#fff" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </ChildBlurModal>
  );
}
