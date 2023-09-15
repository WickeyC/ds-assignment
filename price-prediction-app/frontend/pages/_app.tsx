import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Layout from "../components/Layout"; // Import the NavBar component
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Product Recommender System</title>
        <link rel="icon" href="/img/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${inter.variable} font-sans antialiased h-full`}>
        <Layout />
        <Component {...pageProps} />
      </div>
    </>
  );
}
