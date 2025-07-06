import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import BottomNavigation from "@/components/BottomRow";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mwave | Your Finance Tracker",
  description: "Track your expenses seamlessly with Mwave ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16`}
      >
        <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
          <Navbar/>
          <Toaster/>
          
        {children}
       
        <BottomNavigation/>
        <Footer/>
       


        </ThemeProvider>

      </body>
    </html>
  );
}
