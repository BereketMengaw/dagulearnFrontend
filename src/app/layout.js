import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/page";
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
  title: "Dagulearn",
  keywords:
    "dagulearn, dagu, learn, dagu learn, dagu learn app, dagu learn website",
  authors: [
    {
      name: "Dagu Learn",
      url: "https://dagulearn.vercel.app",
    },
  ],
  description: "DaguLearn is the first platform in Ethiopia to offer YouTube course monetization, designed to facilitate learning and knowledge-sharing. It connects learners and creators by providing access to high-quality courses and resources. DaguLearn empowers creators to design, manage, and monetize their courses, while enabling learners to access engaging educational content. Whether you're looking to enhance your skills or share your expertise, DaguLearn makes learning accessible, interactive, and impactful for everyone.",
  creator: "DaguLearn",
  publisher: "DaguLearn",
  applicationName: "DaguLearn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "dagulearn",
  description: "DaguLearn is the first platform in Ethiopia to offer YouTube course monetization, designed to facilitate learning and knowledge-sharing. It connects learners and creators by providing access to high-quality courses and resources. DaguLearn empowers creators to design, manage, and monetize their courses, while enabling learners to access engaging educational content. Whether you're looking to enhance your skills or share your expertise, DaguLearn makes learning accessible, interactive, and impactful for everyone.",
    url: "dagulearn.vercel.app",
    siteName: "DaguLearn",
    images: [
      {
        url: "../../public/images/Thumbnail.jpg", // Ensure this is a full URL
        width: 1200,
        height: 630,
        alt: "FOR DAGU LEARN",
      },
    ],
    locale: "en-US",
    type: "website",
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
          <Footer />
        </body>
      </html>
    </>
  );
}
