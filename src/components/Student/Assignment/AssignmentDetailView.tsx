"use client";
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
  console.log("assignment details", assingmentDetails);

  const assignment = assingmentDetails?.result?.assignment;
  const answer = assingmentDetails?.result?.answer;
  const isGraded = answer?.status === "Graded";

  return (
    <div className="px-4">
      <div className="bg-white rounded-2xl p-5">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

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

          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Attachments:</span>
            <a
              href={assignment?.bookData?.coverImg}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </div>

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
        <button className="mb-8 w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-blue-600 hover:bg-gray-50">
          Open Book
        </button>
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
                  className="w-full rounded-lg"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
