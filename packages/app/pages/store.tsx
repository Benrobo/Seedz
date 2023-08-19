import Layout, { MobileLayout } from "@/components/Layout";
import React from "react";

function Store() {
  return (
    <Layout className="bg-white-105">
      <MobileLayout activePage="store">welcome</MobileLayout>
    </Layout>
  );
}

export default Store;
