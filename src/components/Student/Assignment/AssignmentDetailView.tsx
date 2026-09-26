"use client";
import { Button } from "@/components/ui/button";
import { useGetassignmentDetailsQuery } from "@/redux/api/student/assignmentApi";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface AssignmentDetailViewProps {
  assignments: {
    id: string;
    title: string;
    description: string;
    status: "Submitted" | "Graded";
    grade?: string;
    feedback?: string;
    answer: string;
    attachmentName?: string;
    attachmentUrl?: string;
  };
  onBack: () => void;
}

export function AssignmentDetailView({
  assignments,
  onBack,
}: AssignmentDetailViewProps) {
  const id = assignments?.id;
  const { data: assingmentDetails } = useGetassignmentDetailsQuery(id);


  const assignment = assingmentDetails?.result?.assignment;
  const answer = assingmentDetails?.result?.answer;

  const feedbackText = answer?.feedBack || answer?.feedback;
  const grade = answer?.grade || answer?.assignmentGrade;
  const isGraded =
    answer?.status === "Graded" ||
    assignments?.status === "Graded" ||
    Boolean(grade || feedbackText);

  const formatGrade = (gradeVal?: string) => {
    if (!gradeVal) return "";
    const gradeMap: Record<string, string> = {
      A_plus: "A+",
      A: "A",
      A_minus: "A-",
      B_plus: "B+",
      B: "B",
      B_minus: "B-",
      C_plus: "C+",
      C: "C",
      C_minus: "C-",
      D: "D",
      F: "F",
    };
    return gradeMap[gradeVal] || gradeVal;
  };

  const attachmentUrl = assignment?.attachment || assignment?.attachament;
  const isAttachmentImage = Boolean(
    attachmentUrl && /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(attachmentUrl)
  );

  const bookPdf =
    assignment?.bookData?.file ||
    assignment?.bookData?.bookPdf ||
    assignment?.bookFile ||
    assignment?.bookPdf;
  const bookId = assignment?.bookData?.id || assignment?.bookId;
  const hasBook = Boolean(bookPdf || bookId);

  const handleOpenBook = () => {
    if (bookPdf) {
      window.open(
        `/student/books/read?pdfurl=${encodeURIComponent(bookPdf)}`,
        "_blank"
      );
    } else if (bookId) {
      window.open(`/student/books/bookDetails/${bookId}`, "_blank");
    }
  };

  return (
    <div className="px-4">
      <div className="bg-white rounded-2xl p-5">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="default"
          className="mb-8 flex items-center gap-2 bg-gray-200 text-black hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Button>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {assignment?.title}
          </h1>
          <p className="mt-2 text-gray-600">{assignment?.instruction}</p>
        </div>

        {/* Assignment Details */}
        <div className="mb-8 space-y-3 rounded-lg bg-gray-50 p-6">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Pages:</span>
            <span className="text-gray-600">
              {assignment?.startPage} to {assignment?.endPage}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Due date:</span>
            <span className="text-gray-600">
              {new Date(assignment?.dueDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Attachments:</span>
            {attachmentUrl ? (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                View Attachment
              </a>
            ) : (
              <span className="text-gray-600">No attachments</span>
            )}
          </div>

          {isAttachmentImage && (
            <div className="pt-1">
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block relative max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-white p-1 hover:opacity-90 transition"
                title="Click to view full image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachmentUrl}
                  alt="Assignment Attachment"
                  className="max-h-48 w-auto rounded object-contain"
                />
              </a>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Status:</span>
            <span
              className={`font-semibold text-xs px-2.5 py-1 rounded-full ${
                isGraded
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isGraded ? "Graded" : (answer?.status || assignments?.status || "Submitted")}
            </span>
          </div>

          {/* Grade and Feedback (only for graded) */}
          {isGraded && (
            <>
              {grade && (
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-gray-900">Grade:</span>
                  <span className="font-bold text-base text-blue-700 bg-blue-50 px-3 py-0.5 rounded-md border border-blue-200">
                    {formatGrade(grade)}
                  </span>
                </div>
              )}
              {feedbackText && (
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="block font-semibold text-gray-900">
                      Teacher Feedback:
                    </span>
                    {answer?.gradeBy && (
                      <span className="text-xs text-gray-500 font-medium">
                        By {answer.gradeBy}
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-gray-800 shadow-xs">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {feedbackText.trim()}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Open Books Button */}
        {hasBook ? (
          <Button
            type="button"
            onClick={handleOpenBook}
            className="mb-8 w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-blue-600 hover:bg-gray-50 cursor-pointer"
          >
            Open Book
          </Button>
        ) : (
          <Button
            disabled
            className="mb-8 w-full rounded-lg border border-gray-200 bg-gray-50 py-3 font-medium text-gray-400 cursor-not-allowed"
          >
            Book Not Available
          </Button>
        )}
      </div>

      {/* Answer Section */}
      <div className="pt-6">
        {answer?.studentAnswer && (
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Your Answer</h2>
            <p className="text-gray-600">{answer.studentAnswer}</p>
          </div>
        )}

        {/* Attachment Section */}
        {answer?.studentAttachment && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Attachment</h3>
            <div className="rounded-lg bg-gray-100 p-4">
              {answer.studentAttachment.endsWith(".pdf") ? (
                <a
                  href={answer.studentAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              ) : (
                <Image
                  src={answer.studentAttachment}
                  alt="Attachment"
                  className="w-[665px] mx-auto rounded-lg object-contain"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
