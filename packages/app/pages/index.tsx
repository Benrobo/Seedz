import ImageTag from "@/components/Image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function Home() {
  return (
    <div className="w-full h-[100vh] bg-green-700 flex flex-col items-center justify-center px-[4em] ">
      <div className="w-auto absolute top-2 right-4">
        <UserButton />
      </div>
      <div className="w-full h-[100vh] flex flex-col items-center justify-center">
        <div className="w-full h-auto flex flex-col items-center justify-center">
          <div className="w-auto flex items-center justify-center">
            <ImageTag
              src="/assets/img/logo/leaf-logo.svg"
              className="w-[70px] h-[70px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
              alt="seedz"
            />
            <span className="N-EB text-[30px] text-white-100">Seedz</span>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <p className="text-white-100 text-[15px] mt-3 N-B">
              Empowering Farmers, Enhancing Productivity
            </p>
            <br />
            <br />
            <Link
              className="w-full max-w-[300px] bg-green-600 text-white-100 rounded-[30px] ppM text-[14px] flex items-center justify-center text-center px-3 py-3"
              href="/auth/signup"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
