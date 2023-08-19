import "@/styles/globals.css";
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

const publicPages = ["/auth/login", "/auth/signup"];
const queryClient = new QueryClient();

const client = new ApolloClient({
  uri: ENV.serverUrl,
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

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
