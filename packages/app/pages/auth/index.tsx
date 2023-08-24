import Link from "next/link";
import { useEffect } from "react";
import ImageTag from "../../components/Image";
import ENV from "../api/config/env";
import { Passage } from "@passageidentity/passage-js";
import withoutAuth from "@/helpers/withoutAuth";

function Login() {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-green-700">
      <div className="w-full h-full px-4 py-3 flex flex-col items-center justify-center absolute top-0 left-0 z-[10]">
        <div className="w-auto flex items-center justify-center">
          <Link href="/">
            <ImageTag
              src="/assets/img/logo/leaf-logo.svg"
              className="w-[70px] h-[70px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
              alt="seedz"
            />
          </Link>
          <span className="N-EB text-[30px] text-white-100">Seedz</span>
        </div>
        <div className="w-full mt-4 max-w-[350px] border-solid border-[2px] border-white-600 scale-[.85] pp-SB z-[10] rounded-[10px] overflow-hidden ">
          {/* @ts-ignore */}
          <passage-auth app-id={ENV.passageAppId ?? "None"}></passage-auth>
        </div>
      </div>
    </div>
  );
}
export default withoutAuth(Login);
