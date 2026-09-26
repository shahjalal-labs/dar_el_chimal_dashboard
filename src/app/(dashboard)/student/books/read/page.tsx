"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import { TfiAngleLeft } from "react-icons/tfi";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";
import { PiSpinner } from "react-icons/pi";

function ReadBookContent() {
  const route = useRouter();
  const params = useSearchParams();
  const pdfUrl = params.get("pdfurl");

  // Generate high-speed CDN streaming URL for the PDF
  const streamingUrl = useMemo(() => {
    if (!pdfUrl) return null;
    return getOptimizedPdfUrl(pdfUrl);
  }, [pdfUrl]);

  if (!pdfUrl) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="text-gray-600 font-medium">PDF not specified or not found</div>
        <Button
          onClick={() => route.back()}
          className="bg-white text-black border hover:bg-gray-50 cursor-pointer shadow-sm"
        >
          <TfiAngleLeft className="mr-2" /> Back
        </Button>
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
          <div className="flex h-full items-center justify-center text-gray-500">
            No PDF file found.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReadBookPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[70vh] flex items-center justify-center gap-3">
          <PiSpinner className="h-8 w-8 animate-spin text-[#1E3A8A]" />
          <span className="text-gray-600 font-medium">Loading viewer...</span>
        </div>
      }
    >
      <ReadBookContent />
    </Suspense>
  );
}