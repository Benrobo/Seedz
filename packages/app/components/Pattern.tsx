import React from "react";
import { twMerge } from "tailwind-merge";

interface PatternProps {
  className?: React.ComponentProps<"div">["className"];
}

function Pattern({ className }: PatternProps) {
  return <div className={twMerge(className, "pattern-bg")}></div>;
}

export default Pattern;
