import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import TopNavbar from "@/components/Navbar/TopNavbar";

export const metadata: Metadata = {
  title: "Dar El Chimal",
  description: "Your all-in-one hub for learning, teaching, growing together. Join a community of teachers and students making education simple, fun, and accessible—anytime, anywhere.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="w-full overflow-y-auto bg-[#F6F6F6]">
        <TopNavbar />
        <div className="p-6 mt-24">{children}</div>
      </div>
    </div>
  );
}

