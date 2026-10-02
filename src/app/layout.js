import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/page";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://dagulearn.vercel.app"),
  title: "DaguLearn — Learn from Ethiopia's best creators",
  icons: { icon: "/favicon.ico" },
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
    url: "https://dagulearn.vercel.app",
    siteName: "DaguLearn",
    images: [
      {
        url: "/images/Thumbnail.jpg",
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
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
