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
    <div>
      <Button
        onClick={() => route.back()}
        className="mb-6 bg-white/80 text-black hover:text-white cursor-pointer"
      >
        <TfiAngleLeft />
        Back
      </Button>

      <div className="w-full h-screen flex justify-center items-center">
        {streamingUrl ? (
          <PdfReader pdfUrl={streamingUrl} hideDownloadAndPrint={true} />
        ) : (
          <p>No PDF file found.</p>
        )}
      </div>
    </div>
  );
};

export default PDF;
