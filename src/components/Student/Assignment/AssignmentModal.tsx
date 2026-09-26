/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useGetassignmentDetailsQuery,
  useSubmitAssingmentAnsMutation,
} from "@/redux/api/student/assignmentApi";
import { Upload, X, Trash2, FileText } from "lucide-react";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
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

  const assignment = assignmentDetails?.result?.assignment ?? assignments;
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
    } else {
      toast.error("Book not found for this assignment");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const attachmentPreviewUrl = useMemo(() => {
    if (!attachment) return null;
    if (attachment.type.startsWith("image/")) {
      return URL.createObjectURL(attachment);
    }
    return null;
  }, [attachment]);

  useEffect(() => {
    return () => {
      if (attachmentPreviewUrl) {
        URL.revokeObjectURL(attachmentPreviewUrl);
      }
    };
  }, [attachmentPreviewUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
        handleRemoveAttachment();
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

  const isPending = assignments?.status === "Pending";

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

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl my-auto overflow-hidden">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100 p-2 rounded-full h-9 w-9 flex items-center justify-center cursor-pointer shadow-none"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 pr-10">
            {assignment.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{assignment.instruction}</p>

          {/* Assignment Details */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 border border-gray-100">
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
                    alt="Assignment attachment"
                    className="max-h-40 w-auto rounded object-contain"
                  />
                </a>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Status:</span>
              <span
                className={`font-medium ${
                  isPending ? "text-orange-500" : "text-red-500"
                }`}
              >
                {isPending ? "Pending" : "Missed"}
              </span>
            </div>
          </div>

          {/* Open Books Button */}
          <Button
            type="button"
            onClick={handleOpenBook}
            disabled={isSubmitting || !hasBook}
            className={`w-full rounded-lg border py-3 font-medium transition ${
              hasBook
                ? "border-gray-300 bg-white text-blue-600 hover:bg-gray-50 cursor-pointer shadow-sm"
                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            {hasBook ? "Open Books" : "Book Not Available"}
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
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Attachment Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-gray-900">
                Attachment (Optional)
              </label>
              {attachment && (
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  disabled={isSubmitting}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
              id="file-upload"
              disabled={isSubmitting}
            />

            {attachment ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-gray-300 transition">
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  {attachmentPreviewUrl ? (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachmentPreviewUrl}
                        alt="Selected attachment preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="h-7 w-7" />
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-medium text-sm text-gray-900 truncate"
                      title={attachment.name}
                    >
                      {attachment.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        {attachment.type.startsWith("image/") ? "Image" : "PDF"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <label
                    htmlFor="file-upload"
                    className={`text-xs font-medium text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 border border-gray-200 rounded-md px-2.5 py-1.5 transition shadow-xs ${
                      isSubmitting
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    Change
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    disabled={isSubmitting}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer disabled:opacity-50"
                    title="Remove attachment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className={`border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/20 bg-gray-50/50 rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-2 group ${
                  isSubmitting
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    Click to upload
                  </span>
                  <span className="text-sm text-gray-500"> or drag and drop</span>
                </div>
                <span className="text-xs text-gray-400">
                  PNG, JPG, JPEG, or PDF (Max 10MB)
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons (pinned at bottom so user can always see & click them) */}
        <div className="flex gap-4 p-4 sm:px-8 border-t border-gray-100 bg-gray-50/80 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-white hover:bg-gray-100 border-gray-300 cursor-pointer"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}