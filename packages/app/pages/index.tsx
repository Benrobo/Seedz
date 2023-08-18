import Layout from "@/components/Layout";
import { UserButton, currentUser } from "@clerk/nextjs";
import { GetServerSideProps } from "next";
import React from "react";

export default function Home({ props }: { props: any }) {
  console.log(props);

  return (
    <Layout>
      <UserButton afterSignOutUrl="/" />
      <div>Your pages content can go here.</div>
    </Layout>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {

// };
