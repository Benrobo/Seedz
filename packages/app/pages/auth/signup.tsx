import ImageTag from "@/components/Image";
import withoutAuth from "@/helpers/withoutAuth";
import { useMutation, useQuery } from "@apollo/client";
import { SignIn, SignUp } from "@clerk/nextjs";
import React from "react";
import { twMerge } from "tailwind-merge";
import { UpdateUserRole } from "../../http";
import { Spinner } from "@/components/Spinner";
import toast from "react-hot-toast";
import handleApolloHttpErrors from "../../http/error";
import Link from "next/link";

function Signup() {
  const [steps, setSteps] = React.useState(1);
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

  const handleNextPrevState = () => {
    if (steps === 2) {
      setSteps(1);
    } else {
      if (role.length === 0) {
        toast.error("Select A Role ");
        return;
      }
      localStorage.setItem("@userRole", JSON.stringify(role as string));
      setSteps(2);
    }
  };

  return (
    <div className="w-full bg-green-700 flex flex-col items-center justify-center px-[4em] ">
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
        <div className="w-full max-w-[450px] h-[400px] flex-wrap px-[2em] py-[3em] bg-white-100 flex items-center justify-center gap-2 rounded-md">
          {steps === 1 && (
            <div className="w-full flex flex-col items-center text-center">
              <p className="text-dark-100 N-B ">What your Role?</p>
            </div>
          )}
          {steps === 1 ? (
            validRoles.map((d) => (
              <button
                onClick={() => selectedRoles(d.name)}
                key={d.name}
                className={twMerge(
                  "w-[120px] bg-white-100 scale-[.80] shadow-2xl px-5 py-5 rounded-lg flex flex-col items-center justify-center border-[5px] border-transparent ",
                  d.role === role &&
                    "border-solid border-[5px] border-green-700 "
                )}
              >
                <span className="text-3xl ">{d.icon}</span>
                <p className="text-green-700 text-1xl mt-2 N-EB ">{d.name}</p>
              </button>
            ))
          ) : (
            <div className="scale-[.90]">
              <SignUp signInUrl="/auth/login" />
            </div>
          )}
          <div className="w-full mt-5 flex flex-col items-center justify-center">
            <button
              className="w-full bg-green-700 shadow-2xl px-3 py-2 rounded-[30px] flex flex-col items-center justify-center"
              onClick={handleNextPrevState}
            >
              <p className="text-white-100 text-1xl N-B ">
                {steps === 1 ? "Continue" : "Go Back"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withoutAuth(Signup);
