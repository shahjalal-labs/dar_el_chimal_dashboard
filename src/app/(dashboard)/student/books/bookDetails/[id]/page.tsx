"use client";

import Attachments from "@/components/Student/Book/BooksOverview/Attachments";
import GeneralOverview from "@/components/Student/Book/BooksOverview/GeneralOverview";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

type ActiveTab = "general" | "resources";

export default function BackToSchoolPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  const params = useParams();
  const id = params.id as string;
  console.log("id book", id);

  return (
    <main className="">
      {/* Container */}
      <div className="mx-auto container px-4 ">
        <div>
          <h1 className="text-[24px] font-bold text-[#11031B] mb-3">
            Book Overview
          </h1>
        </div>
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            <Button
              onClick={() => setActiveTab("general")}
              className={`pb-4 font-medium transition-all duration-500 ease-in-out cursor-pointer ${
                activeTab === "general"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              General
            </Button>
            <Button
              onClick={() => setActiveTab("resources")}
              className={`pb-4 font-medium transition-all duration-500 ease-in-out cursor-pointer ${
                activeTab === "resources"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Resources
            </Button>
          </div>
        </div>

        {activeTab === "general" && <GeneralOverview bookId={id} />}

        {activeTab === "resources" && <Attachments bookId={id} />}
      </div>
    </main>
  );
}
