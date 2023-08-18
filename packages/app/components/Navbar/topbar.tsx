import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxCaretDown } from "react-icons/rx";
import ImageTag from "../Image";
import { BiCog } from "react-icons/bi";
import socials from "../../data/socials.json";
import { IoLockOpen } from "react-icons/io5";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
// import ErrorBanner from "../ErrorBanner";

function TopBar() {
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
      className={`w-full h-auto fixed top-0 left-0 z-[200] ${
        isScrolledPast ? "bg-white-500" : "bg-none"
      } backdrop-blur bg-opacity-75 `}
    >
      <div className="w-full px-[5rem] py-10 flex items-center justify-start gap-20">
        {/* Logo */}
        <div className=" max-w-[40px] flex flex-col items-center justify-center bg-white-100 rounded-[50%] ">
          <p className="N-EB px-4 py-2">B</p>
        </div>
        {/* Navlinks */}
        <ul className="w-full h-auto flex items-center justify-center gap-20">
          <a href="" className="N-B text-[13px] text-white-300">
            Home
          </a>
          <a href="#about" className="N-B text-[13px] text-white-300">
            About
          </a>
          <a href="" className="N-B text-[13px] text-white-300">
            Projects
          </a>
          <a href="" className="N-B text-[13px] text-white-300">
            Blog
          </a>
        </ul>
        {/* Socials */}
        <ul className="flex items-center justify-center gap-7">
          {socials.map((d) => (
            <a
              key={d.name}
              href={d.url}
              className="text-white-300 hover:text-white-100 text-[20px] "
            >
              {renderSocialIcon(d.name)}
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TopBar;

function renderSocialIcon(name: string) {
  let icon = null;
  if (name === "twitter") {
    icon = <AiOutlineTwitter className="" />;
  }
  if (name === "github") {
    icon = <AiFillGithub className="" />;
  }
  if (name === "linkedin") {
    icon = <FaLinkedin className="" />;
  }
  return icon;
}
