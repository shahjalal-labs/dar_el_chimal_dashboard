"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { Button } from "@/components/ui/button";
import { TfiAngleLeft } from "react-icons/tfi";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";

const PDF = () => {
  const route = useRouter();
  const fileUrl = useSearchParams().get("pdfurl");

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
    <div>
      <Button
        onClick={() => route.back()}
        className="bg-white/80 text-black hover:text-white cursor-pointer"
      >
        <TfiAngleLeft />
        Back
      </Button>
      <div className="w-full h-screen flex justify-center items-center">
        {streamingUrl ? (
          <PdfReader pdfUrl={streamingUrl} hideDownloadAndPrint={false} />
        ) : (
          <p>No PDF file found.</p>
        )}
      </div>
    </div>
  );
};

export default PDF;