"use client";
import { Button } from "@/components/ui/button";
import { useGetassignmentDetailsQuery } from "@/redux/api/student/assignmentApi";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const isGraded = answer?.status === "Graded";

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

          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Status:</span>
            <span
              className={`font-medium ${
                isGraded ? "text-gray-500" : "text-green-500"
              }`}
            >
              {answer?.status || "Submitted"}
            </span>
          </div>

          {/* Grade and Feedback (only for graded) */}
          {isGraded && (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Grade:</span>
                <span className="text-gray-600">{answer?.grade}</span>
              </div>
              <div className="space-y-2 pt-4">
                <span className="block font-semibold text-gray-900">
                  Feedback:
                </span>
                <p className="text-gray-600">{answer?.feedBack}</p>
              </div>
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
