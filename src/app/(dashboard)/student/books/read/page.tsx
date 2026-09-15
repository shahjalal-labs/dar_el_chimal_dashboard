"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { TfiAngleLeft } from "react-icons/tfi";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";

export default function ReadBookPage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">PDF not found</div>
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={() => route.back()}
        className="mb-2 bg-white/80 text-black hover:text-white cursor-pointer"
      >
        <TfiAngleLeft />
        Back
      </Button>
      {streamingUrl ? (
        <PdfReader pdfUrl={streamingUrl} hideDownloadAndPrint={true} />
      ) : (
        <div className="text-center text-gray-600">No PDF file found.</div>
      )}
    </div>
  );
}