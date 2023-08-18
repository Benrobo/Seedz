import { SignIn, SignUp } from "@clerk/nextjs";
import React from "react";

function Login() {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <SignUp signInUrl="/auth/login" />
    </div>
  );
}

export default Login;
