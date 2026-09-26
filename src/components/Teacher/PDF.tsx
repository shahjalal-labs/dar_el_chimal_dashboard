"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TfiAngleLeft } from "react-icons/tfi";
import { Button } from "../ui/button";
import PdfReader from "../Student/Book/BookReader/PdfReader";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";

const PDF = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("pdfurl");

  // Generate high-speed CDN streaming URL for the PDF
  const streamingUrl = useMemo(() => {
    if (!fileUrl) return null;
    return getOptimizedPdfUrl(fileUrl);
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">PDF not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] w-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <Button
          onClick={() => route.back()}
          className="bg-white/90 text-black hover:text-white cursor-pointer shadow-sm border border-gray-200"
        >
          <TfiAngleLeft className="mr-1" />
          Back
        </Button>
      </div>

      <div className="flex-1 w-full min-h-[550px] relative">
        {streamingUrl ? (
          <PdfReader pdfUrl={streamingUrl} hideDownloadAndPrint={true} />
        ) : (
          <p className="text-gray-500">No PDF file found.</p>
        )}
      </div>
    </div>
  );
};

export default PDF;
