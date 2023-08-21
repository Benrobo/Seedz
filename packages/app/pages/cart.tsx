import Layout, { MobileLayout } from "@/components/Layout";
import { ChildBlurModal } from "@/components/Modal";
import { Router, useRouter } from "next/router";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

function Cart() {
  const router = useRouter();
  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="cart" className="h-[100vh] overflow-y-hidden">
        <div className="w-full relative flex items-center justify-center px-[1em] ">
          <button
            className="w-auto rounded-md text-[12px] bg-none N-B text-dark-100 flex items-center justify-start absolute left-3 top-1"
            onClick={() => router.push("/store")}
          >
            <IoIosArrowBack size={20} />
          </button>
          <p className="text-dark-100 ppM flex items-center justify-center gap-2">
            Details
          </p>
        </div>
        <div className="w-full h-[100vh] flex flex-wrap items-start justify-between gap-3 px-[.4em] mt-5 overflow-y-auto"></div>

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

export default Cart;
