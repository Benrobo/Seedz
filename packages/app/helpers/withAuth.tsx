import React from "react";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

interface WithAuthProps {
  fn: () => React.ReactElement;
  clerk?: any;
}

const withAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const { isLoaded, userId, sessionId, getToken } = useAuth();

    console.log({ log: userId, sessionId, getToken: getToken() });

    React.useEffect(() => {
      const isLoggedIn = true;
      // const isLoggedIn = checkIfUserIsLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
