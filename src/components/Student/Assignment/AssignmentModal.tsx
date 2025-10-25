/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useGetassignmentDetailsQuery,
  useSubmitAssingmentAnsMutation,
} from "@/redux/api/student/assignmentApi";
import { Upload, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "Missed";
  };
  refetch: () => Promise<any>;
}

export function AssignmentModal({
  isOpen,
  onClose,
  assignments,
  refetch,
}: AssignmentModalProps) {
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move the hook calls to the top level - before any conditional returns
  const id = assignments?.id;
  const { data: assignmentDetails } = useGetassignmentDetailsQuery(id, {
    skip: !isOpen || !id, // Skip the query if modal is not open or no ID
  });
  const [submitAssignmentAnsFn] = useSubmitAssingmentAnsMutation();

  // Early return after all hooks have been called
  if (!isOpen) return null;

  const assignment = assignmentDetails?.result?.assignment ?? assignments;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const data = {
        answer: answer,
      };
      // Add answer text to formData
      formData.append("bodyData", JSON.stringify(data));

      // Add file if exists
      if (attachment) {
        formData.append("file", attachment);
      }

      // Submit using RTK Query mutation
      const response = await submitAssignmentAnsFn({
        id,
        formData,
      }).unwrap();

      // Reset form and close modal on success
      if (response?.success) {
        toast.success("Answer submitted successfully");
        refetch();
        setAnswer("");
        setAttachment(null);
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit assignment:", error);
      // You might want to show an error toast here
      toast.error("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = assignments.status === "Pending";

  // ✅ Format due date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Modal Content */}
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            {assignment.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600">{assignment.instruction}</p>

          {/* Assignment Details */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Pages:</span>
              <span className="text-gray-600">
                {assignment?.startPage ?? "N/A"} to{" "}
                {assignment?.endPage ?? "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Due date:</span>
              <span className="text-gray-600">
                {formatDate(assignment?.dueDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Attachments:</span>
              {assignment?.attachment ? (
                <a
                  href={assignment.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              ) : (
                <span className="text-gray-600">No attachments</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Status:</span>
              <span
                className={`font-medium ${isPending ? "text-orange-500" : "text-red-500"
                  }`}
              >
                {isPending ? "Pending" : "Missed"}
              </span>
            </div>
          </div>

          {/* Open Books Button */}
          <Button
            className="w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-blue-600 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Open Books
          </Button>

          {/* Your Answer Section */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={6}
              disabled={isSubmitting}
            />
          </div>

          {/* Attachment Section */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">
              Attachment (Optional)
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center gap-2 ${isSubmitting
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                  }`}
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-gray-600">
                  {attachment ? attachment.name : "Attach Image or PDF"}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}