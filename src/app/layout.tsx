import type { Metadata } from "next";
import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareTrayBar from "@/components/car/CompareTrayBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "RevEngine | Every Spec. Every Rev.",
    template: "RevEngine | %s",
  },
  description:
    "RevEngine is an interactive automotive encyclopedia and car-specification comparison platform for enthusiasts — discover, compare and save the cars that define performance.",
  openGraph: {
    title: "RevEngine | Every Spec. Every Rev.",
    description:
      "The ultimate automotive spec vault. Discover, compare, and save enthusiast cars from every era and manufacturer.",
    siteName: "RevEngine",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareTrayBar />
      </body>
    </html>
  );
}
