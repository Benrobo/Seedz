import ImageTag from "@/components/Image";
import { SignIn, SignUp } from "@clerk/nextjs";
import React from "react";

function Login() {
  const [steps, setSteps] = React.useState(1);

  const handlecNextPrevState = () => {
    if (steps === 2) {
      setSteps(1);
    } else {
      setSteps(2);
    }
  };

  return (
    <div className="w-full bg-green-700 flex flex-col items-center justify-center px-[4em] ">
      <div className="w-full h-[100vh] max-w-[500px] flex flex-col items-center justify-center">
        <div className="w-full h-auto flex items-center justify-center">
          <div className="w-auto flex items-center justify-center">
            <ImageTag
              src="/assets/img/logo/leaf-logo.svg"
              className="w-[70px] h-[70px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
              alt="seedz"
            />
            <span className="N-EB text-[30px] text-white-100">Seedz</span>
          </div>
        </div>
        <br />
        <br />
        {true && (
          <div className="w-full max-w-[450px] flex-wrap h-auto px-[2em] py-[3em] bg-white-100 flex items-center justify-center gap-2 rounded-md">
            {steps === 1 ? (
              <>
                <button className="w-[120px] bg-white-100 scale-[.80] shadow-2xl px-5 py-5 rounded-md flex flex-col items-center justify-center">
                  <span className="text-3xl ">💼</span>
                  <p className="text-green-700 text-1xl mt-2 N-EB ">Merchant</p>
                </button>
                <button className="w-[120px] bg-white-100 scale-[.80] shadow-2xl px-5 py-5 rounded-md flex flex-col items-center justify-center">
                  <span className="text-3xl "> 🛍️</span>
                  <p className="text-green-700 text-1xl mt-2 N-EB ">Buyer</p>
                </button>
                <button className="w-[120px] bg-white-100 scale-[.80] shadow-2xl px-5 py-5 rounded-md flex flex-col items-center justify-center">
                  <span className="text-3xl "> 📦</span>
                  <p className="text-green-700 text-1xl mt-2 N-EB ">Supplier</p>
                </button>
              </>
            ) : (
              <div className="scale-[.90]">
                <SignUp signInUrl="/auth/login" />
              </div>
            )}
            <div className="w-full mt-5 flex flex-col items-center justify-center">
              <button
                className="w-full bg-green-700 shadow-2xl px-3 py-2 rounded-[30px] flex flex-col items-center justify-center"
                onClick={handlecNextPrevState}
              >
                <p className="text-white-100 text-1xl N-B ">
                  {steps === 1 ? "Continue" : "Go Back"}
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
