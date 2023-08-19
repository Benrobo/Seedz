import React from "react";
import { BiHomeAlt, BiSolidHomeAlt2, BiSolidUser } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

function BottomNav() {
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <div className="w-full h-[80px] absolute bottom-0 px-[1em] py-[10px] z-[100] bg-white-100 drop-shadow-2xl flex items-center justify-between gap-5">
      <BottomNavBtn name="home" title="Home" active={activeTab} />
      <BottomNavBtn name="store" title="Store" active={activeTab} />
      <BottomNavBtn name="cart" title="Cart" active={activeTab} />
      <BottomNavBtn name="profile" title="Profile" active={activeTab} />
    </div>
  );
}

export default BottomNav;

interface BtnProps {
  active: string;
  name: string;
  title: string;
}

function BottomNavBtn({ active, name, title }: BtnProps) {
  function renderIcon() {
    let icon = null;
    if (name === "home") {
      icon = <BiSolidHomeAlt2 size={25} />;
    }
    if (name === "store") {
      icon = <IoStorefrontSharp size={25} />;
    }
    if (name === "cart") {
      icon = <FaShoppingCart size={25} />;
    }
    if (name === "profile") {
      icon = <BiSolidUser size={25} />;
    }
    if (name === "assistant") {
      icon = <BsRobot size={25} />;
    }
    return icon;
  }

  return (
    <button
      className={twMerge(
        "flex flex-col items-center justify-center px-4 py-3 rounded-[50%] transition-all hover:text-green-600",
        active === name ? "text-green-600" : "text-white-400 "
      )}
    >
      {renderIcon()}
      <span
        className={twMerge(
          "text-[12px] ppR ",
          active === name ? "text-green-600" : "text-white2-700"
        )}
      >
        {title}
      </span>
    </button>
  );
}
