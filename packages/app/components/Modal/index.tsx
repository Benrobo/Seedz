import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface ModalProp {
  isOpen?: boolean;
  onClose?: () => void;
  showCloseIcon?: boolean;
  children?: React.ReactNode;
  isBlurBg?: boolean;
  fixed?: boolean;
  className?: React.ComponentProps<"div">["className"];
}

const Modal = ({
  children,
  isOpen,
  showCloseIcon,
  onClose,
  fixed,
  className,
}: ModalProp) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const blurBg = `backdrop-blur-xl opacity-[1]`;
  const transBg = ``;

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClickOutside = (e: Event) => {
    const tgt = (e.target as any)?.dataset;
    const name = tgt.name;
    name && onClose;
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={twMerge(
        `w-full hideScrollBar backdrop-blur bg-dark-600 bg-opacity-75 h-[100vh] ${
          fixed ? "fixed z-[250px]" : "absolute"
        } top-0 left-0 flex flex-col items-center justify-center z-[50] overflow-y-auto hideScollBar py-5`,
        className
      )}
      data-name="main-modal"
    >
      <div className={`${isVisible ? "opacity-100" : "opacity-0"}`}>
        {showCloseIcon && (
          <div className="absolute top-10 right-0 p-1 z-[70]">
            {/* @ts-ignore */}
            <button
              className={
                "flex flex-col items-center justify-center px-4 py-3 rounded-[10px] transition-all text-dark-100 hover:bg-dark-200 hover:text-white-100"
              }
            >
              <IoClose />
            </button>
          </div>
        )}
        <div className="relative w-full h-screen">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

export const ChildBlurModal = ({
  children,
  isOpen,
  showCloseIcon,
  onClose,
  fixed,
  isBlurBg,
  className,
}: ModalProp) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const blurBg = `backdrop-blur-xl opacity-[1]`;
  const transBg = ``;

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClickOutside = (e: Event) => {
    const tgt = (e.target as any)?.dataset;
    const name = tgt.name;
    name && onClose;
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={twMerge(
        `w-full ${
          isBlurBg && "backdrop-blur bg-white-500 bg-opacity-75"
        } h-[100vh] ${
          fixed ? "fixed" : "absolute"
        } top-0 left-0 right-0 bottom-0 z-[999] flex flex-col items-center justify-center overflow-y-auto hideScollBar py-5`,
        className
      )}
      data-name="main-modal"
    >
      <div className={`w-full ${isVisible ? "opacity-100" : "opacity-0"}`}>
        {showCloseIcon && (
          <div className="absolute top-3 right-0 p-1 z-[70]">
            <button
              className={
                "flex flex-col items-center justify-center px-4 py-3 rounded-[10px] transition-all text-white-100 hover:bg-dark-200 hover:text-white-100"
              }
              onClick={onClose}
            >
              <IoClose />
            </button>
          </div>
        )}
        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  );
};
