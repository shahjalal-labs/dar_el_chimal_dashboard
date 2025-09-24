import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dar El Chimal",
  description: "Your all-in-one hub for learning, teaching, growing together. Join a community of teachers and students making education simple, fun, and accessible—anytime, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
