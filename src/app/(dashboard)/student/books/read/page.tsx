"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { TfiAngleLeft } from "react-icons/tfi";

export default function ReadBookPage() {
  const route = useRouter();
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
    <div>
      <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>
      <PdfReader
        bookId="default-book-id"
        pdfUrl={pdfUrl}
        totalPages={1000000}
        isButton={false}
      />
    </div>
  );
}