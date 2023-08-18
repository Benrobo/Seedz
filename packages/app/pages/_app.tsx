import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";

const publicPages = [];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
