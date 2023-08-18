import React from "react";
import Pattern from "./Pattern";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full relative h-[100vh] overflow-y-auto bg-dark-105">
      <div className="z-upper">{children}</div>
    </div>
  );
}

export default Layout;
