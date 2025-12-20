"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { TfiAngleLeft } from "react-icons/tfi";

export default function ReadBookPage() {
  const route = useRouter();
  const params = useSearchParams();
  const pdfUrl = params.get("pdfurl");

  // Generate streaming URL for the PDF using backend API
  const streamingUrl = useMemo(() => {
    if (!pdfUrl) return null;
    
    // Use backend streaming endpoint
    const encodedUrl = encodeURIComponent(pdfUrl);
    const baseUrl = 'https://api.darelchimalapp.com/api/v1';
    return `${baseUrl}/book/test-pdf-reader/${encodedUrl}`;
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
      <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>
      {streamingUrl ? (
        <PdfReader
          bookId="default-book-id"
          pdfUrl={streamingUrl}
          totalPages={1000000}
          isButton={false}
          useStreaming={true}
        />
      ) : (
        <div className="text-center text-gray-600">No PDF file found.</div>
      )}
    </div>
  );
}