import { LazyLoadImg } from "@/components/Image";
import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import { Router, useRouter } from "next/router";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { CurrencySymbol } from "./api/helper";
import { AllProductProp } from "@/@types";
import withAuth from "@/helpers/withAuth";

function Cart() {
  const router = useRouter();
  const [allCartItems, setAllCartItems] = React.useState(
    [] as AllProductProp[]
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setInterval(() => {
        const cartItems =
          window.localStorage.getItem("@seedz_cart") === null
            ? []
            : JSON.parse(window.localStorage.getItem("@seedz_cart") as string);
        setAllCartItems(cartItems);
      }, 1000);
    }
  }, []);

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
                allCartItems.map((d) => (
                  <ItemCard
                    key={d?.id}
                    id={d.id}
                    imgUrl={d?.image?.url}
                    hash={d?.image?.hash}
                    name={d?.name}
                    price={d?.price}
                    ratings={d?.ratings?.rate}
                  />
                ))
              ) : (
                <p className="text-white-400 ppR text-[13px] ">
                  No items in cart.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Product Modal */}
        <ChildBlurModal
          isBlurBg={false}
          isOpen={false}
          className="bg-white-100 items-start hideScrollBar"
        ></ChildBlurModal>
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
}

function ItemCard({ name, price, id, hash, imgUrl }: ItemCardProps) {
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
        <div className="w-auto flex items-center justify-between ">
          <p className="text-dark-100 N-B text-[14px] ">{name}</p>
        </div>
        <div className="w-auto flex items-center justify-between mt-5">
          <p className="N-B text-[15px] ">
            <span className="text-white-400">{CurrencySymbol.NGN}</span>
            <span className="text-dark-100 N-B">{price}</span>
          </p>
          <div className="ml-4 flex items-center justify-between gap-3">
            <button className="bg-white2-300 px-2 py-[1px] rounded-[50%] text-dark-100 border-none flex flex-col items-center justify-center">
              -
            </button>
            <span className="text-dark-100 N-B text-[14px] ">1</span>
            <button className="bg-white2-300 px-2 py-[1px] rounded-[50%] text-dark-100 border-none flex flex-col items-center justify-center">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
