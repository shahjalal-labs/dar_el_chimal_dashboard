/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useGetBookDetailsQuery } from "@/redux/api/student/booksApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PiSpinner } from "react-icons/pi";
import { FiAlertTriangle } from "react-icons/fi";

interface GradeItem {
  grade: string;
}

interface Grade {
  gradesinthisSchool?: GradeItem[];
}

interface BookOverviewData {
  coverImg: string;
  bookName: string;
  description: string;
  ISBN: string;
  author: string;
  grades?: Grade[];
  file: string;
}

interface BookOverviewResponse {
  result?: BookOverviewData;
}

interface GeneralOverviewProps {
  bookId: string | number;
}

function GeneralOverview({ bookId }: GeneralOverviewProps) {
  const router = useRouter();
  const { data: getBooksOverview, error, isLoading } = useGetBookDetailsQuery(bookId);

  const bookOverviewData: BookOverviewData | undefined = (
    getBooksOverview as BookOverviewResponse
  )?.result;

  const gradesList: string[] =
    bookOverviewData?.grades?.flatMap(
      (g: Grade) =>
        g?.gradesinthisSchool?.map((item: GradeItem) => item?.grade) || []
    ) || [];

  const handleOpenBook = () => {
    router.push(`/student/books/read?pdfurl=${encodeURIComponent(bookOverviewData?.file || '')}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 flex flex-col justify-center items-center min-h-[300px]">
        <PiSpinner className="h-8 w-8 animate-spin text-[#1E3A8A] mb-3" />
        <span className="text-gray-600 font-medium">Loading book details...</span>
      </div>
    );
  }

  if (error || !bookOverviewData) {
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "Access Denied: This book is not assigned to you, or does not exist.";

    return (
      <section className="bg-white rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-10">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorMessage}
        </p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => router.push("/student/books")}
            className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 px-6 font-medium"
          >
            Return to My Books
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-5">
      {/* Banner Image */}
      <div className="mb-8 overflow-hidden rounded-lg h-[355px]">
        <Image
          src={bookOverviewData?.coverImg || "/default-cover.jpg"}
          alt="Back to School Banner"
          width={1200}
          height={300}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {bookOverviewData?.bookName || "Book Title Not Available"}
          </h1>
        </div>

        {/* Subtitle */}
        <div>
          <p className="text-lg text-gray-600">
            {bookOverviewData?.description || "No description available"}
          </p>
        </div>

        {/* Details Card */}
        <div className="space-y-4 rounded-lg bg-gray-50 p-6 sm:p-8">
          <div className="grid gap-4 ">
            {/* Grade Level */}
            <div className="flex gap-24">
              <span className="font-semibold text-gray-900">Grade Level:</span>
              <span className="text-gray-600">
                {gradesList.length > 0 ? gradesList.join(", ") : "N/A"}
              </span>
            </div>

            {/* Edition */}
            <div className="flex gap-24">
              <span className="font-semibold text-gray-900">Edition:</span>
              <span className="text-gray-600">
                {bookOverviewData?.ISBN || "N/A"}
              </span>
            </div>

            {/* Author */}
            <div className="flex gap-24">
              <span className="font-semibold text-gray-900">Author:</span>
              <span className="text-gray-600">
                {bookOverviewData?.author || "Unknown Author"}
              </span>
            </div>

            {/* Language */}
            <div className="flex gap-24">
              <span className="font-semibold text-gray-900">Language:</span>
              <span className="text-gray-600">English</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Back
          </Button>
          <Button
            onClick={handleOpenBook}
            className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
          >
            Open Book
          </Button>
        </div>
      </div>
    </section>
  );
}

export default GeneralOverview;
