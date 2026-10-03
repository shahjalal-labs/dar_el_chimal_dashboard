/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import {
  setPreviewResourceFile,
  setResourceDescription,
  setResourceFile,
  setResourceLink,
  setResourceTitle,
  setResourceType,
} from "@/redux/features/bookSlice";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { useCreateResourceMutation } from "@/redux/api/resource";
import {
  FileText,
  Headphones,
  Video,
  UploadCloud,
  Trash2,
  X,
  Link2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

interface ResourceTypeOption {
  type: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
  activeBg: string;
  accept: string;
}

const RESOURCE_TYPES: ResourceTypeOption[] = [
  {
    type: "Audio",
    label: "Audio",
    desc: "Audio lessons & guides",
    icon: Headphones,
    activeColor: "text-amber-600",
    activeBg: "bg-amber-50",
    accept: "audio/*,.mp3,.wav,.m4a,.aac",
  },
  {
    type: "Video",
    label: "Video",
    desc: "Video lectures & clips",
    icon: Video,
    activeColor: "text-emerald-600",
    activeBg: "bg-emerald-50",
    accept: "video/*,.mp4,.mov,.webm,.mkv",
  },
  {
    type: "Pdf",
    label: "PDF",
    desc: "Documents & slides",
    icon: FileText,
    activeColor: "text-rose-600",
    activeBg: "bg-rose-50",
    accept: ".pdf,.doc,.docx,.ppt,.pptx",
  },
  {
    type: "Image",
    label: "Image",
    desc: "Photos, charts & diagrams",
    icon: ImageIcon,
    activeColor: "text-purple-600",
    activeBg: "bg-purple-50",
    accept: "image/*,.png,.jpg,.jpeg,.webp,.avif,.svg",
  },
];

const detectResourceType = (file: File | null, link: string): string => {
  if (file) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const mime = file.type.toLowerCase();

    if (
      mime.startsWith("image/") ||
      ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg", "bmp"].includes(ext)
    ) {
      return "Image";
    }
    if (
      mime.startsWith("audio/") ||
      ["mp3", "wav", "m4a", "aac", "ogg", "flac", "wma"].includes(ext)
    ) {
      return "Audio";
    }
    if (
      mime.startsWith("video/") ||
      ["mp4", "mov", "webm", "mkv", "avi", "wmv", "flv"].includes(ext)
    ) {
      return "Video";
    }
    return "Pdf";
  }

  if (link) {
    const lower = link.toLowerCase();
    if (
      lower.includes("youtube.com") ||
      lower.includes("youtu.be") ||
      lower.includes("vimeo.com") ||
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm")
    ) {
      return "Video";
    }
    if (
      lower.includes("soundcloud.com") ||
      lower.includes("spotify.com") ||
      lower.endsWith(".mp3") ||
      lower.endsWith(".wav")
    ) {
      return "Audio";
    }
    if (
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".svg") ||
      lower.includes("imgur.com")
    ) {
      return "Image";
    }
    return "Pdf";
  }

  return "Pdf";
};

const Resource = ({
  bookId,
  setIsAddResource,
}: {
  bookId: any;
  setIsAddResource: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();

  // Local component state to avoid persisting across pages or books
  const [resourceType, setLocalResourceType] = useState<string>("");
  const [resourceTitle, setLocalResourceTitle] = useState<string>("");
  const [resourceDescription, setLocalResourceDescription] = useState<string>("");
  const [resourceFile, setLocalResourceFile] = useState<File | null>(null);
  const [resourceLink, setLocalResourceLink] = useState<string>("");
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  const [CreateResource, { isLoading: isResourceLoading }] = useCreateResourceMutation();


  const handleClear = () => {
    setLocalResourceType("");
    setLocalResourceTitle("");
    setLocalResourceDescription("");
    setLocalResourceFile(null);
    setLocalResourceLink("");
    setIsAutoDetected(false);

    dispatch(setResourceType(""));
    dispatch(setResourceTitle(""));
    dispatch(setResourceDescription(""));
    dispatch(setResourceFile(null));
    dispatch(setPreviewResourceFile(""));
    dispatch(setResourceLink(""));
  };

  const handleCancel = () => {
    handleClear();
    setIsAddResource(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setLocalResourceFile(file);
      // Auto-detect type from file
      const detected = detectResourceType(file, resourceLink);
      setLocalResourceType(detected);
      setIsAutoDetected(true);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalResourceLink(val);
    if (!resourceFile && val && !resourceType) {
      const detected = detectResourceType(null, val);
      setLocalResourceType(detected);
      setIsAutoDetected(true);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLocalResourceFile(null);
    if (isAutoDetected) {
      setLocalResourceType("");
      setIsAutoDetected(false);
    }
  };

  const selectedTypeConfig = RESOURCE_TYPES.find((t) => t.type === resourceType);
  const acceptAttribute =
    selectedTypeConfig?.accept ||
    ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mp3,.wav,.m4a";

  // Type is NOT strictly required — auto-detected if omitted
  const isButtonDisabled =
    !resourceTitle.trim() ||
    (!resourceFile && !resourceLink.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resourceTitle.trim()) {
      toast.warning("Please enter a resource title");
      return;
    }

    if (!resourceFile && !resourceLink.trim()) {
      toast.warning("Please attach a file or provide a link");
      return;
    }

    // Auto-detect type if not explicitly selected
    const finalType = resourceType || detectResourceType(resourceFile, resourceLink);
    // Ensure backend description requirement is satisfied
    const finalDescription = resourceDescription.trim() || resourceTitle.trim();

    const body = {
      title: resourceTitle.trim(),
      description: finalDescription,
      Type: finalType,
      file: resourceLink.trim() || undefined,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(body));
    if (resourceFile) {
      formData.append("file", resourceFile);
    }

    try {
      const response = await CreateResource({ bookId, formData }).unwrap();
      if (response.success) {
        toast.success(response.message || "Resource uploaded successfully");
        handleClear();
        setIsAddResource(false);
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message || "Something went wrong while uploading");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload New Resource</h2>
          <p className="text-sm text-[#636F85] mt-1">
            Add supplementary materials or files to this book
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 w-fit self-start sm:self-auto cursor-pointer"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>

      {/* Resource Type (Optional & Auto-detected) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Label className="block text-sm font-semibold text-[#30373D]">
            Resource Type
          </Label>
          <span className="inline-flex items-center gap-1 text-xs text-[#636F85] bg-gray-100 px-2 py-0.5 rounded-md font-normal">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Optional &bull; Auto-detected from file
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RESOURCE_TYPES.map((item) => {
            const isSelected = resourceType === item.type;
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.type}
                onClick={() => {
                  setLocalResourceType(item.type);
                  setIsAutoDetected(false);
                }}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#1E3A8A] text-white"
                      : `${item.activeBg} ${item.activeColor}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        isSelected ? "text-[#1E3A8A]" : "text-gray-800"
                      }`}
                    >
                      {item.label}
                    </p>
                    {isSelected && isAutoDetected && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-medium">
                        Auto
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-[#1E3A8A] bg-[#1E3A8A]" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label className="block text-sm font-semibold text-[#30373D] mb-1.5">
          Resource Title <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          placeholder="e.g., Chapter 1 Summary & Exercises"
          value={resourceTitle}
          onChange={(e) => setLocalResourceTitle(e.target.value)}
          className="border-[#CBD5E1] focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] rounded-lg"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label className="block text-sm font-semibold text-[#30373D] mb-1.5">
          Description (Optional)
        </Label>
        <textarea
          placeholder="Add optional notes or instructions for students..."
          className="border border-[#CBD5E1] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] outline-none rounded-lg p-3 w-full h-24 text-sm resize-y"
          value={resourceDescription}
          onChange={(e) => setLocalResourceDescription(e.target.value)}
        />
      </div>

      {/* File Upload or Link */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="block text-sm font-semibold text-[#30373D]">
              Attach File
            </Label>
            {resourceFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove file
              </button>
            )}
          </div>

          {!resourceFile ? (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept={acceptAttribute}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 hover:border-[#1E3A8A] transition-colors rounded-xl flex flex-col justify-center items-center w-full p-6 bg-gray-50/50 hover:bg-[#F0F4FF]/40">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A] mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-[#30373D] font-medium text-sm text-center">
                  Click or drag file to attach
                </p>
                <p className="text-xs text-[#636F85] mt-1 text-center">
                  Supports PDF, Audio, Video, Office docs & images
                </p>
              </div>
            </label>
          ) : (
            <div className="border-2 border-[#1E3A8A]/30 bg-[#F0F4FF] rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-sm">
                  {resourceType === "Audio" ? (
                    <Headphones className="w-5 h-5" />
                  ) : resourceType === "Video" ? (
                    <Video className="w-5 h-5" />
                  ) : resourceType === "Image" ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-xs md:max-w-md">
                      {resourceFile.name}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800 shrink-0">
                      Selected
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(resourceFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-4">
                <label className="cursor-pointer text-xs font-medium text-[#1E3A8A] hover:bg-white bg-white/80 border border-[#1E3A8A]/40 px-3 py-1.5 rounded-lg transition shadow-2xs">
                  Change
                  <input
                    type="file"
                    accept={acceptAttribute}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs font-medium text-gray-400 uppercase tracking-wider absolute">
            Or provide a link
          </span>
        </div>

        {/* URL Link */}
        <div>
          <Label className="block text-sm font-semibold text-[#30373D] mb-1.5">
            External Link (Optional if file attached)
          </Label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="url"
              placeholder="https://..."
              value={resourceLink}
              onChange={handleLinkChange}
              className="pl-9 border-[#CBD5E1] focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="px-6 border-gray-300 text-[#636F85] hover:bg-gray-50 font-medium cursor-pointer"
        >
          Clear
        </Button>

        <Button
          type="submit"
          disabled={isButtonDisabled || isResourceLoading}
          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium px-8 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResourceLoading ? (
            <div className="flex items-center gap-2">
              <PiSpinner className="animate-spin h-4 w-4" />
              <span>Uploading...</span>
            </div>
          ) : (
            "Upload Resource"
          )}
        </Button>
      </div>
    </form>
  );
};

export default Resource;