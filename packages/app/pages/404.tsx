import useIsAuth from "@/helpers/useIsAuth";
import Link from "next/link";
import React from "react";

function NotFound() {
  const isLoggedIn = useIsAuth();

  return (
    <div className="w-full h-[100vh] bg-green-700 flex flex-col items-center justify-center">
      <h1 className="N-B text-white-100 text-2xl md:text-3xl">
        404 | Page Notfound
      </h1>
      <Link
        href={isLoggedIn ? "/dashboard" : "/"}
        className="px-4 py-2 min-w-[200px] mt-9 bg-white-100 text-center rounded-[30px] text-dark-100 N-B transition-all border-solid border-[3px] border-transparent hover:border-white-100 hover:bg-green-705 hover:text-white-100"
      >
        {isLoggedIn ? "Dashboard" : "Go Home"}
      </Link>
    </div>
  );
}

export default NotFound;
