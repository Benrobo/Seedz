import isAuthenticated from "@/utils/isAuthenticated";
import React from "react";

interface UserInfo {
  email: string;
  image: string;
  fullname: string;
  id: string;
  role: string;
}

function useAuth() {
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({} as UserInfo);

  React.useEffect(() => {
    setLoading(true);
    const token =
      localStorage.getItem("psg_auth_token") === null
        ? ""
        : localStorage.getItem("psg_auth_token");
    const isLoggedIn = isAuthenticated(token as string);

    setLoading(false);

    if (isLoggedIn) {
      const user =
        localStorage.getItem("@userInfo") === null
          ? null
          : JSON.parse(localStorage.getItem("@userInfo") as string);
      setUserInfo(user);
    }
  }, []);

  return {
    isLoading: loading,
    seedzUserInfo: userInfo,
  };
}

export default useAuth;
