import ImageTag from "@/components/Image";
import withoutAuth from "@/helpers/withoutAuth";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function Login() {
  return (
    <div className="w-full h-[100vh] bg-green-700 flex flex-col items-center justify-center px-[4em] ">
      <div className="w-full h-[100vh] flex flex-col items-center justify-center">
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
        <SignIn signUpUrl="/auth/signup" />
      </div>
    </div>
  );
}

export default withoutAuth(Login);
