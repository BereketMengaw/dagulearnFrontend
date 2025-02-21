import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "DAGULEARN",
  description:
    "The first well organised paid course sharing platform open for anyone ",
  icons: {
    icon: "/favicon.ico", // or "/favicon.png"
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        {/* Preconnect to Google Fonts and Gstatic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

        {/* Link to Google Fonts for Delicious Handrawn */}
        <link
          href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>

      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </>
  );
}
