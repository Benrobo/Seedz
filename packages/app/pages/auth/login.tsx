import { SignIn } from "@clerk/nextjs";
import React from "react";

function Login() {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <SignIn signUpUrl="/auth/signup" />
    </div>
  );
}

export default Login;
