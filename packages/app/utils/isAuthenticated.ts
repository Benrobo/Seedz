import jwtDecode from "jwt-decode";
import { isEmpty } from ".";

const clearLocalStorage = () => {
  localStorage.removeItem("psg_auth_token");
  localStorage.removeItem("userData");
};

// meant to be called from client

function isAuthenticated(token: string) {
  if (!token || isEmpty(token)) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);
    const expirationTime = (decodedToken as any).exp * 1000; // convert to milliseconds

    if (Date.now() >= expirationTime) {
      clearLocalStorage();
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error verifying passage token: ${error}`);
    // clearLocalStorage();
    return false;
  }
}

export default isAuthenticated;
