import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import isAuthenticated from "@/utils/isAuthenticated";

const withoutAuth = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    useEffect(() => {
      const token = localStorage.getItem("psg_auth_token");
      const isLoggedIn = isAuthenticated(token as string);
      if (isLoggedIn) {
        router.push("/dashboard");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
