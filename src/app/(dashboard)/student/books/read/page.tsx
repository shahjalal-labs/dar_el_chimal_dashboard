"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { useSearchParams } from "next/navigation";

export default function ReadBookPage() {
  const params = useSearchParams();
  const pdfUrl = params.get("pdfurl");

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">PDF not found</div>
      </div>
    );
  }

  return (
    <PdfReader
      bookId="default-book-id"
      pdfUrl={pdfUrl}
      totalPages={1000000}
    />
  );
}