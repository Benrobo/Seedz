import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface LoaderModalProp {
  showLabel?: boolean;
  position?: "absolute" | "fixed";
}

interface SpinnerCompProp {
  color?: string;
  size?: number;
}

export function LoaderModal({ showLabel, position }: LoaderModalProp) {
  const validPosition = position === "absolute" ? "absolute" : "fixed";
  return (
    <div
      className={`w-full backdrop-blur bg-opacity-85 h-[100vh] ${validPosition} top-0 left-0 right-0 bottom-0 z-[150] hideScollBar flex flex-col items-center justify-center`}
      data-name="main-modal"
    >
      <Spinner />
      {showLabel && <p className="text-white-200 mt-3 text-1xl ">Loading...</p>}
    </div>
  );
}

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 25,
  color = "blue-200",
}) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: `${color}`,
    borderRightColor: `${color}`,
    borderBottomColor: `transparent`,
    borderLeftColor: `transparent`,
    // borderColor: `${color}`,
  };

  return (
    <div
      id="showccial-spinner"
      className="rounded-full border-4 animate-spin-fast"
      style={spinnerStyle}
    ></div>
  );
};
