import React from "react";
import { useRouter } from "next/router";
import isAuthenticated from "@/utils/isAuthenticated";

// mostly used for other pages aside from auth page
const withAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    React.useEffect(() => {
      const token = localStorage.getItem("psg_auth_token");
      const isLoggedIn = isAuthenticated(token as string);
      if (!isLoggedIn) {
        router.push("/auth");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
