import React from "react";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import useIsAuth from "./useIsAuth";

interface WithAuthProps {
  fn: () => React.ReactElement;
  clerk?: any;
}

// mostly used for auth page
const withoutAuth = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const isLoggedIn = useIsAuth();
    const { isLoaded } = useAuth();

    React.useEffect(() => {
      if (isLoggedIn && isLoaded) {
        router.push("/dashboard");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
