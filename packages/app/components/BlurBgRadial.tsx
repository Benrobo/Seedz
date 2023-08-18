import React from "react";
import { twMerge } from "tailwind-merge";

interface BlurBgRadialProp {
  w?: number;
  h?: number;
  color?: string;
  blurWidth?: "normal" | "medium" | "large";
  className?: React.ComponentProps<"div">["className"];
  roundedCorners?: number;
}

function BlurBgRadial({
  w,
  h,
  roundedCorners,
  color,
  blurWidth,
  className,
}: BlurBgRadialProp) {
  const blurConfig = {
    normal: 90,
    medium: 100,
    large: 120,
  };

  const SIZE =
    typeof w === "undefined" || typeof h === "undefined"
      ? "w-[35%] h-[55%]"
      : `w-[${w}%] h-[${h}%]`;
  const BLUR_WIDTH =
    typeof blurWidth === "undefined"
      ? "blur-[120px]"
      : `blur-[${blurConfig[blurWidth]}px]`;
  const borderRadius =
    typeof roundedCorners === "undefined"
      ? "rounded-[50%]"
      : `rounded-[${roundedCorners}%]`;

  return (
    <div
      className={twMerge(
        `z-[10] fixed top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] ${SIZE} ${BLUR_WIDTH} ${borderRadius} `,
        className
      )}
      style={{
        background: color ?? "#77777743",
      }}
    ></div>
  );
}

export default BlurBgRadial;
