import { useAuth } from "@clerk/nextjs";

function useIsAuth() {
  const { userId } = useAuth();
  if (typeof userId === "undefined" || userId === null) {
    return false;
  }
  return true;
}

export default useIsAuth;
