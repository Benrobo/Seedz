import Layout from "@/components/Layout";
import withAuth from "@/helpers/withAuth";
import React from "react";

function Dashboard() {
  return (
    <Layout>
      <div>Dashboard</div>
    </Layout>
  );
}

export default withAuth(Dashboard);
