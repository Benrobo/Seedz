import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineMail, AiOutlineTwitter } from "react-icons/ai";
// import socialLinks from "../../data/socials.json";
import ImageTag from "../Image";

interface NavbarProp {
  showLinks?: boolean;
  showSocials?: boolean;
  showLogo?: boolean;
}

function Navbar({ showLinks, showSocials, showLogo }: NavbarProp) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 30) {
      setIsScrolledPast(true);
    } else {
      setIsScrolledPast(false);
    }
  }, [scrollY]);

  return (
    <div
      className={`w-full flex items-center justify-between px-[2rem] py-[1rem] ${
        isScrolledPast
          ? "bg-dark-400 backdrop-blur bg-opacity-75"
          : "bg-dark-400"
      } fixed top-0 left-0 z-[10] border-b-[1px] border-b-solid border-b-white-600 `}
    >
      <div id="left" className="w-auto flex items-center justify-center">
        {showLogo && (
          <Link href="/">
            <ImageTag
              src="/images/logos/showccial-logo2.svg"
              alt="showccial logo"
              className="w-[50px] cursor-pointer"
            />
          </Link>
        )}
        <p className="text-white-100 ml-3 text-[1rem] pp-RG veryBold">
          showccial
        </p>
        {showLinks && (
          <div className="ml-[3rem] w-auto">
            <ul className="flex items-center justify-between gap-10">
              <li className="text-white-200 text-[15px] pp-RG">
                <Link href="/">Features</Link>
              </li>
              <li className="text-white-200 text-[15px] pp-RG">
                <Link href="/">Pricing</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div id="right" className="w-auto mr-5">
        {showSocials && (
          <div className="w-full ml-3 flex items-center justify-between gap-3">
            {/* <a href={socialLinks.socials["twitter"]} target="__blank">
              <AiOutlineTwitter className=" text-[16px] text-white-200 " />
            </a>
            <a href={socialLinks.socials["email"]} target="__blank">
              <AiOutlineMail className=" text-[16px] text-white-200 " />
            </a> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
