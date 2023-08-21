import Link from "next/link";
import React from "react";
import { BiHomeAlt, BiSolidHomeAlt2, BiSolidUser } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface BottomNavProp {
  activePage: string;
}
function BottomNav({ activePage }: BottomNavProp) {
  const [activeTab, setActiveTab] = React.useState(activePage);

  //   React.useEffect(() => {
  //     setActiveTab(activePage);
  //   }, [activePage]);

  return (
    <div className="w-full h-[80px] absolute bottom-0 px-[1em] py-[10px] z-[100] bg-white-100 drop-shadow-2xl flex items-center justify-between gap-5">
      <BottomNavBtn name="dashboard" title="Home" active={activePage} />
      <BottomNavBtn name="store" title="Store" active={activePage} />
      <BottomNavBtn name="cart" title="Cart" active={activePage} />
      <BottomNavBtn name="profile" title="Profile" active={activePage} />
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
  const [cartItemsCount, setCartItemsCount] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setInterval(() => {
        const cartItems =
          window.localStorage.getItem("@seedz_cart") === null
            ? []
            : JSON.parse(localStorage.getItem("@seedz_cart") as string);
        setCartItemsCount(cartItems.length);
      }, 500);
    }
  }, []);

  React.useEffect(() => {
    const cartItems =
      localStorage.getItem("@seedz_cart") === null
        ? []
        : JSON.parse(localStorage.getItem("@seedz_cart") as string);
    setCartItemsCount(cartItems.length);
  }, []);

  function renderIcon() {
    let icon = null;
    if (name === "dashboard") {
      icon = <BiSolidHomeAlt2 size={25} />;
    }
    if (name === "store") {
      icon = <IoStorefrontSharp size={25} />;
    }
    if (name === "cart") {
      icon = (
        <div className="w-auto relative">
          {cartItemsCount > 0 && (
            <p className="text-white-100 N-B px-2 py-[2px] flex flex-col items-center justify-center scale-[.75] bg-green-600 rounded-[50%] text-[12px] absolute top-[-14px] right-[-14px] ">
              {cartItemsCount}
            </p>
          )}
          <FaShoppingCart size={25} />
        </div>
      );
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
    <Link
      href={`/${name}`}
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
    </Link>
  );
}
