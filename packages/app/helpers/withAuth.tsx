import React from "react";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import useIsAuth from "./useIsAuth";

// mostly used for other pages aside from auth page
const withAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const { isLoaded } = useAuth();
    const isLoggedIn = useIsAuth();
    React.useEffect(() => {
      if (isLoggedIn === false && isLoaded) {
        router.push("/auth/login");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
