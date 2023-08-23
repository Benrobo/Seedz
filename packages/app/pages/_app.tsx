import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
} from "@apollo/client";
import ENV from "./api/config/env";
import { errorLink, httpLink } from "@/helpers/clientError";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Router } from "next/router";
import nProgress from "nprogress";
import "../styles/globals.css";
import "../styles/nprogress.css";
import "react-circular-progressbar/dist/styles.css";

const queryClient = new QueryClient();

const client = new ApolloClient({
  uri: ENV.serverUrl,
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

console.log({ server: ENV.serverUrl });

// nprogress loader
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => {
      await client.refetchQueries({
        include: "active", // refetch all queries for "active" or specific query ["QUERY_NAME"]
      });
    })();
  }, []);

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
          <Toaster />
        </ClerkProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
