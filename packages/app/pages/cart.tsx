import ImageTag, { LazyLoadImg } from "@/components/Image";
import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import { Router, useRouter } from "next/router";
import React from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosCloseCircle,
} from "react-icons/io";
import { CurrencySymbol, formatCurrency } from "./api/helper";
import { AllProductProp } from "@/@types";
import withAuth from "@/helpers/withAuth";
import toast from "react-hot-toast";
import { MdLocationOn } from "react-icons/md";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { useMutation } from "@apollo/client";
import { ProductCheckout } from "../http";
import handleApolloHttpErrors from "../http/error";
import { IoClose } from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";

function Cart() {
  const router = useRouter();
  const [allCartItems, setAllCartItems] = React.useState(
    [] as AllProductProp[]
  );
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [checkoutPayModal, setCheckoutPayModal] = React.useState(false);
  const [paymentProgress, setPaymentProgress] = React.useState(false);
  const [prodCheckoutMutation, prodCheckoutMutProps] =
    useMutation(ProductCheckout);
  const [checkoutError, setCheckoutError] = React.useState(null);
  const [progressBarPercents, setProgressBarPercents] = React.useState(0);
  const [checkoutStatusScreen, setCheckoutStatusScreen] = React.useState(false);

  const updateItemQuantity = (
    itId: string,
    qty: number,
    cartQty: number,
    action: "+" | "-"
  ) => {
    const filteredCartItem = allCartItems.find((item) => item.id === itId);
    const restItems = allCartItems.filter((item) => item.id !== itId);

    if (!filteredCartItem) {
      return; // Item not found, handle this case
    }

    let newCartQty = cartQty;

    if (action === "+") {
      if (newCartQty >= qty) {
        toast.error("Limited quantity available.");
      } else {
        newCartQty = newCartQty + 1;
        // update localstorage
        (filteredCartItem as any).cartQty = newCartQty;
        const comb = [...restItems, filteredCartItem];
        localStorage.setItem("@seedz_cart", JSON.stringify(comb));
      }
    } else if (action === "-") {
      if (newCartQty <= 1) {
        const confirmRemove = window.confirm(
          "Are you sure you want to remove this item?"
        );
        if (confirmRemove) {
          // Remove item logic here
          localStorage.setItem("@seedz_cart", JSON.stringify(restItems));
        }
      } else {
        newCartQty = newCartQty - 1;
        // update localstorage
        (filteredCartItem as any).cartQty = newCartQty;
        const comb = [...restItems, filteredCartItem];
        localStorage.setItem("@seedz_cart", JSON.stringify(comb));
      }
    }

    console.log({ cartQty: newCartQty, name: filteredCartItem.name });
  };

  const handleProductCheckout = () => {
    let checkoutPayload: any[] = [];
    allCartItems.map((d) => {
      checkoutPayload.push({
        prodId: d?.id,
        qty: (d as any)?.cartQty, // this property isn't in the type yet
        name: d?.name,
      });
    });

    const productCheckoutPayload = {
      productQty: checkoutPayload,
      totalAmount: totalPrice,
    };

    setCheckoutPayModal(true);
    setPaymentProgress(true);

    prodCheckoutMutation({
      variables: {
        productCheckoutPayload,
      },
    });
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setInterval(() => {
        const cartItems =
          window.localStorage.getItem("@seedz_cart") === null
            ? []
            : JSON.parse(window.localStorage.getItem("@seedz_cart") as string);
        setAllCartItems(cartItems);
      }, 500);
    }
  }, []);

  React.useEffect(() => {
    if (allCartItems.length === 0) return;
    let prices = [] as number[];
    allCartItems.forEach((item) => {
      if (item.availableForRent) {
        prices.push(item.rentingPrice * (item as any).cartQty);
      }
      if (!item.availableForRent) {
        prices.push(item.price * (item as any).cartQty);
      }
    });
    const total = prices?.reduce((total, price) => (total += price));
    setTotalPrice(total);
  }, [allCartItems]);

  // effect to control progress bar
  React.useEffect(() => {
    if (paymentProgress) {
      let count = 0;
      const interval = setInterval(() => {
        if (prodCheckoutMutProps.loading === true) {
          setProgressBarPercents((count += 10));
        } else {
          const finalCount = 100 - progressBarPercents;
          setProgressBarPercents(finalCount);
          clearInterval(interval);
          setTimeout(() => {
            setPaymentProgress(false);
            setCheckoutStatusScreen(true);
          }, 1000);
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodCheckoutMutProps.data, prodCheckoutMutProps.error]);

  //
  React.useEffect(() => {
    prodCheckoutMutProps.reset();
    if (prodCheckoutMutProps.error) {
      const err = handleApolloHttpErrors(prodCheckoutMutProps.error);
      setCheckoutError(err);
    } else if (
      typeof prodCheckoutMutProps?.data?.productCheckout?.success !==
      "undefined"
    ) {
      setCheckoutError(null);
      // delete localstorage cart
      localStorage.removeItem("@seedz_cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodCheckoutMutProps.data, prodCheckoutMutProps.error]);

  const totalCheckout = `${CurrencySymbol.NGN} ${formatCurrency(
    totalPrice,
    CurrencySymbol.NGN
  )}`;

  const resetCheckoutState = () => {
    setCheckoutPayModal(false);
    setCheckoutStatusScreen(false);
    setProgressBarPercents(0);
    setCheckoutError(null);
    router.push("/cart");
  };

  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="cart" className="h-[100vh] overflow-y-hidden">
        <div className="w-full h-auto flex flex-wrap items-start justify-between gap-3 px-[.4em] mt-5 overflow-y-auto">
          <div className="w-full relative flex items-center justify-center ">
            <button
              className="w-auto rounded-md text-[12px] bg-none N-B text-dark-100 flex items-center justify-start absolute left-3 top-1"
              onClick={() => router.push("/store")}
            >
              <IoIosArrowBack size={20} />
            </button>
            <p className="text-dark-100 ppM flex items-center justify-center gap-2">
              Order Details
            </p>
          </div>

          <div className="w-full px-[1.2em] flex flex-col items-start justify-start">
            <div className="w-full flex flex-col items-start justify-start gap-4 ">
              <p className="text-dark-100 N-B text-[18px]">My Cart</p>
              {allCartItems.length > 0 ? (
                allCartItems
                  .sort((a, b) => {
                    if (a > b) return -1;
                    return 1;
                  })
                  .map((d) => (
                    <ItemCard
                      key={d?.id}
                      id={d.id}
                      imgUrl={d?.image?.url}
                      hash={d?.image?.hash}
                      name={d?.name}
                      price={d?.price}
                      forRent={d?.availableForRent}
                      rentPrice={d?.rentingPrice}
                      ratings={d?.ratings?.rate}
                      quantity={d?.quantity}
                      cartQty={(d as any)?.cartQty}
                      updateQuantity={updateItemQuantity}
                    />
                  ))
              ) : (
                <p className="text-white-400 ppR text-[13px] ">
                  No items in cart.
                </p>
              )}
            </div>
            {allCartItems.length > 0 && (
              <>
                <div className="w-full mt-8 flex flex-col items-start justify-start gap-4">
                  <p className="text-dark-100 N-B text-[18px]">
                    Delivery Location
                  </p>
                  <button className="w-full relative flex items-center justify-start gap-5">
                    {true ? (
                      <>
                        <MdLocationOn
                          size={45}
                          className="p-3 rounded-md text-green-600 bg-white2-200"
                        />
                        <div className="w-auto flex flex-col items-start justify-start">
                          <p className="text-dark-100 N-B text-[14px]">
                            9 Okey Eze street
                          </p>
                          <p className="text-white-400 N-B text-[12px]">
                            10001, Lagos
                          </p>
                          <IoIosArrowForward className="absolute top-2 right-4" />
                        </div>
                      </>
                    ) : (
                      <p className="text-white-400 N-B text-[12px]">
                        Add delivery address.
                      </p>
                    )}
                  </button>
                </div>
                <br />
                <div className="w-full mt-8 flex flex-col items-start justify-start gap-4">
                  <p className="text-dark-100 N-B text-[18px]">Order Info</p>
                  <div className="w-full flex items-start justify-between">
                    <p className="text-white-400 N-B text-[14px]">Total</p>
                    <p className="text-dark-100 N-B text-[14px]">
                      {totalCheckout}
                    </p>
                  </div>
                </div>
                <br />
                <button
                  className={`w-full px-3 py-3 text-[13px] rounded-[30px] bg-green-600 text-white-100 ppR flex items-center justify-around`}
                  onClick={handleProductCheckout}
                >
                  Checkout ({totalCheckout})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Payment */}
        <ChildBlurModal
          isBlurBg={false}
          isOpen={checkoutPayModal}
          showCloseIcon={true}
          onClose={resetCheckoutState}
          className="bg-white-100 items-start hideScrollBar"
        >
          {/* Logo */}
          <div className="w-full relative mt-[4em] flex flex-col items-center justify-center">
            <div className="w-auto flex items-center justify-center">
              <ImageTag
                src="/assets/img/logo/leaf-logo.svg"
                className="w-[30px] h-[30px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
                alt="seedz"
              />
              <span className="N-EB ml-1 mt-1 text-[15px] text-green-600">
                Seedz
              </span>
            </div>
          </div>
          <div className="w-full h-[100vh] flex flex-col items-center justify-center py-4">
            {/* payment progress bar */}
            {paymentProgress && (
              <div
                style={{ width: 250, height: 250 }}
                className="md:w-[220px] w-[200px] "
              >
                <ProgressProvider valueStart={0} valueEnd={progressBarPercents}>
                  {(value: any) => (
                    <CircularProgressbarWithChildren
                      value={value}
                      styles={{
                        // Rotation of path and trail, in number of turns (0-1)
                        path: {
                          // Path color
                          stroke: `#02b151`,
                          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                          strokeLinecap: "butt",
                          // Customize transition animation
                          transition: "stroke-dashoffset 0.5s ease 0s",
                          // Rotate the path
                          transform: "rotate(0.25turn)",
                          transformOrigin: "center center",
                          strokeWidth: 2,
                          borderRadius: 30,
                        },

                        // Customize the circle behind the path, i.e. the "total progress"
                        trail: {
                          // Trail color
                          stroke: "#ffff",
                          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                          strokeLinecap: "butt",
                          // Rotate the trail
                          transform: "rotate(0.25turn)",
                          transformOrigin: "center center",
                          borderRadius: 30,
                        },
                      }}
                    >
                      <div className="w-full flex flex-col items-center justify-center p-1">
                        <p className="text-dark-100 text-[12px] ppR">Total</p>
                        <p className="text-dark-100 text-4xl N-B">
                          {totalCheckout}
                        </p>
                        <p className="text-green-600 text-[12px] ppR">
                          Secure Payment
                        </p>
                      </div>
                    </CircularProgressbarWithChildren>
                  )}
                </ProgressProvider>
                <br />
                <div className="w-full flex flex-col text-center items-center justify-center">
                  <p className="text-dark-100 text-[15px] N-B">
                    Payment Processing...
                  </p>
                  <p className="text-white-400 text-[12px] ppR">
                    Please wait while your transaction is been processed.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Success | Failure Screen */}
            {checkoutStatusScreen && (
              <div className="w-full flex flex-col items-center justify-center py-4">
                <div className="w-full min-h-[10em] flex flex-col items-center justify-center  ">
                  {checkoutError === null ? (
                    <BsCheckCircleFill className="text-5xl text-green-600" />
                  ) : (
                    <IoIosCloseCircle className="text-5xl text-red-300" />
                  )}
                </div>
                <div className="w-full min-h-[20em] flex flex-col items-center justify-center">
                  <p className="text-dark-100 text-[12px] mb-5 ppR">
                    Total amount
                  </p>
                  <p className="text-dark-100 text-5xl N-B">{totalCheckout}</p>
                  <br />
                  <br />
                  <p className="text-dark-100 text-[15px] N-B">
                    {checkoutError === null
                      ? "Payment Successful"
                      : "Payment Failed"}
                  </p>
                  <p className="text-white-400 text-[12px] ppR">
                    {checkoutError}
                  </p>
                  <div className="w-full min-h-[50%] flex flex-col items-center justify-end px-[4em] ">
                    <button
                      className={`w-full px-3 py-3 text-[13px] rounded-[30px] bg-green-600 text-white-100 ppR flex items-center justify-around`}
                      onClick={resetCheckoutState}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ChildBlurModal>
      </MobileLayout>
    </Layout>
  );
}

export default withAuth(Cart);

interface ItemCardProps {
  name: string;
  ratings: number[];
  price: number;
  id: string;
  hash: string;
  imgUrl: string;
  quantity: number;
  cartQty: number;
  forRent: boolean;
  rentPrice: number;
  updateQuantity: (
    itemId: string,
    quantity: number,
    cartQty: number,
    action: "+" | "-"
  ) => void;
}

function ItemCard({
  name,
  price,
  id,
  hash,
  imgUrl,
  quantity,
  cartQty,
  forRent,
  rentPrice,
  updateQuantity,
}: ItemCardProps) {
  return (
    <div className="w-full h-auto flex items-start justify-start rounded-md overflow-hidden ">
      <button
        className="w-[120px] h-[100px] border-none outline-none bg-gray-300 rounded-md "
        data-id={id}
      >
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
      <div className="w-auto flex flex-col items-start justify-start py-3 px-3">
        <div className="w-auto flex flex-col items-center justify-start ">
          <p className="text-dark-100 N-B text-[14px] ">{name.trim()}</p>
          <p className="text-white-400 ppR text-[12px] ">({quantity}) left</p>
        </div>
        <div className="w-auto flex items-center justify-between mt-5">
          <p className="N-B text-[15px] ">
            <span className="text-white-400">{CurrencySymbol.NGN}</span>
            <span className="text-dark-100 N-B">
              {forRent ? rentPrice : price}
            </span>
          </p>
          <div className="ml-4 flex items-center justify-between gap-3">
            <button
              className="bg-white2-300 px-2 py-[1px] rounded-[50%] text-dark-100 border-none flex flex-col items-center justify-center"
              onClick={() => updateQuantity(id, quantity, cartQty, "-")}
            >
              -
            </button>
            <span className="text-dark-100 N-B text-[14px] ">{cartQty}</span>
            <button
              className="bg-white2-300 px-2 py-[1px] rounded-[50%] text-dark-100 border-none flex flex-col items-center justify-center"
              onClick={() => updateQuantity(id, quantity, cartQty, "+")}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgressProvider = ({
  valueStart,
  valueEnd,
  children,
}: {
  valueStart: number;
  valueEnd: number;
  children: Function;
}) => {
  const [value, setValue] = React.useState(valueStart);
  React.useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return children(value);
};
