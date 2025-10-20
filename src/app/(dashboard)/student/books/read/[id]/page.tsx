"use client";

import PdfReader from "@/components/Student/Book/BookReader/PdfReader";
import { useGetBookDetailsQuery } from "@/redux/api/student/booksApi";
import { useParams } from "next/navigation";

// Define the type for the book overview data
interface BookOverviewData {
  file: string;
  totalPages?: number;
}

// Define the type for the API response
interface BookOverviewResponse {
  result?: BookOverviewData;
}

export default function ReadBookPage() {
  const params = useParams();
  const bookId = params.id as string;

  const { data: getBooksOverview, isLoading } = useGetBookDetailsQuery(bookId);

  const bookData: BookOverviewData | undefined = (
    getBooksOverview as BookOverviewResponse
  )?.result;
  console.log("read page ", bookData)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading book...</div>
      </div>
    );
  }

  if (!bookData?.file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Book not found</div>
      </div>
    );
  }

  return (
    <PdfReader
      bookId={bookId}
      pdfUrl={bookData?.file}
      totalPages={bookData?.totalPages || 1000000}
    />
  );
}
