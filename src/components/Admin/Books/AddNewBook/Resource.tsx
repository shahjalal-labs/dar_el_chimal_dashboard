/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  setBookID,
  setIsAddResource,
  setPreviewResourceFile,
  setResourceDescription,
  setResourceFile,
  setResourceLink,
  setResourceTitle,
  setResourceType,
} from "@/redux/features/bookSlice";
import { RootState } from "@/redux/store/store";
import { setActiveBookTab } from "@/redux/features/uiSlice";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { useUploadResourceMutation } from "@/redux/api/book";
import { useCreateResourceMutation } from "@/redux/api/resource";
import { useParams, usePathname, useRouter } from "next/navigation";
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
  ArrowRight,
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

interface ResourceProps {
  bookId?: any;
  setIsAddResource?: (value: boolean) => void;
}

const Resource: React.FC<ResourceProps> = ({
  bookId,
  setIsAddResource: setIsAddResourceProp,
}) => {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const targetBookId = bookId || id;
  const isOverview =
    Boolean(bookId) ||
    Boolean(pathname && pathname.includes("/admin/books/book-overview"));

  const reduxBook = useSelector((state: RootState) => state.book);

  // Initialize from Redux state so toggling between tabs never loses entered data
  const [resourceType, setLocalResourceType] = useState<string>(
    reduxBook.resourceType || ""
  );
  const [resourceTitle, setLocalResourceTitle] = useState<string>(
    reduxBook.resourceTitle || ""
  );
  const [resourceDescription, setLocalResourceDescription] = useState<string>(
    reduxBook.resourceDescription || ""
  );
  const [resourceFile, setLocalResourceFile] = useState<File | null>(
    reduxBook.resourceFile || null
  );
  const [previewResourceUrl, setPreviewResourceUrl] = useState<string>(
    reduxBook.previewResourceFile || (reduxBook.resourceFile ? reduxBook.resourceFile.name : "")
  );
  const [resourceLink, setLocalResourceLink] = useState<string>(
    reduxBook.resourceLink || ""
  );
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [objectUrl, setObjectUrl] = useState<string>("");

  useEffect(() => {
    if (resourceFile) {
      const url = URL.createObjectURL(resourceFile);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl("");
    }
  }, [resourceFile]);

  const previewSource = objectUrl || previewResourceUrl || "";

  const isImage =
    (resourceFile && resourceFile.type.startsWith("image/")) ||
    resourceType === "Image" ||
    Boolean(
      previewSource &&
        (previewSource.startsWith("data:image/") ||
          previewSource.endsWith(".png") ||
          previewSource.endsWith(".jpg") ||
          previewSource.endsWith(".jpeg") ||
          previewSource.endsWith(".webp") ||
          previewSource.endsWith(".svg") ||
          previewSource.endsWith(".gif") ||
          previewSource.endsWith(".avif") ||
          previewSource.includes("cloudinary") ||
          previewSource.includes("images"))
    );

  const isAudio =
    (resourceFile && resourceFile.type.startsWith("audio/")) ||
    resourceType === "Audio";

  const isVideo =
    (resourceFile && resourceFile.type.startsWith("video/")) ||
    resourceType === "Video";

  const [UploadResource, { isLoading: isUploading }] =
    useUploadResourceMutation();
  const [CreateResource, { isLoading: isCreating }] =
    useCreateResourceMutation();

  const isResourceLoading = isUploading || isCreating;

  // Clear if user switched to an entirely different book
  useEffect(() => {
    if (targetBookId && reduxBook.bookId && reduxBook.bookId !== targetBookId) {
      handleClear();
      dispatch(setBookID(targetBookId));
    } else if (targetBookId && !reduxBook.bookId) {
      dispatch(setBookID(targetBookId));
    }
  }, [targetBookId]);

  const handleTitleChange = (val: string) => {
    setLocalResourceTitle(val);
    dispatch(setResourceTitle(val));
  };

  const handleDescriptionChange = (val: string) => {
    setLocalResourceDescription(val);
    dispatch(setResourceDescription(val));
  };

  const handleTypeSelect = (type: string, auto: boolean = false) => {
    setLocalResourceType(type);
    setIsAutoDetected(auto);
    dispatch(setResourceType(type));
  };

  const handleClear = () => {
    setLocalResourceType("");
    setLocalResourceTitle("");
    setLocalResourceDescription("");
    setLocalResourceFile(null);
    setPreviewResourceUrl("");
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
    if (setIsAddResourceProp) {
      setIsAddResourceProp(false);
    }
    dispatch(setIsAddResource(false));
    if (!isOverview) {
      router.push("/admin/books");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setLocalResourceFile(file);
      setPreviewResourceUrl("");
      dispatch(setResourceFile(file));
      dispatch(setPreviewResourceFile(file.name));
      const detected = detectResourceType(file, resourceLink);
      handleTypeSelect(detected, true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) {
      setLocalResourceFile(file);
      setPreviewResourceUrl("");
      dispatch(setResourceFile(file));
      dispatch(setPreviewResourceFile(file.name));
      const detected = detectResourceType(file, resourceLink);
      handleTypeSelect(detected, true);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalResourceLink(val);
    dispatch(setResourceLink(val));
    if (!resourceFile && val && !resourceType) {
      const detected = detectResourceType(null, val);
      handleTypeSelect(detected, true);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLocalResourceFile(null);
    setPreviewResourceUrl("");
    dispatch(setPreviewResourceFile(""));
    dispatch(setResourceFile(null));
    if (isAutoDetected) {
      setLocalResourceType("");
      setIsAutoDetected(false);
      dispatch(setResourceType(""));
    }
  };

  const selectedTypeConfig = RESOURCE_TYPES.find(
    (t) => t.type === resourceType
  );
  const acceptAttribute =
    selectedTypeConfig?.accept ||
    ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mp3,.wav,.m4a";

  const isButtonDisabled =
    isOverview &&
    (!resourceTitle.trim() || (!resourceFile && !resourceLink.trim()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalType =
      resourceType || detectResourceType(resourceFile, resourceLink);
    const finalDescription =
      resourceDescription.trim() || resourceTitle.trim();

    if (isOverview) {
      if (!resourceTitle.trim()) {
        toast.warning("Please enter a resource title");
        return;
      }

      if (!resourceFile && !resourceLink.trim()) {
        toast.warning("Please attach a file or provide a link");
        return;
      }

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
        const response = await CreateResource({
          bookId: targetBookId,
          formData,
        }).unwrap();
        if (response.success) {
          toast.success(response.message || "Resource uploaded successfully");
          handleClear();
          dispatch(setIsAddResource(false));
          if (setIsAddResourceProp) {
            setIsAddResourceProp(false);
          }
        }
      } catch (error) {
        toast.warning(
          (error as any)?.data?.message || "Something went wrong while uploading"
        );
      }
    } else {
      // Wizard flow (/admin/books/add-new-book)
      const hasResourceData = Boolean(
        resourceTitle.trim() ||
          resourceFile ||
          resourceLink.trim() ||
          previewResourceUrl
      );

      if (!hasResourceData) {
        // Cleanly advance to next step if no resource is added
        dispatch(setActiveBookTab("grade"));
        return;
      }

      if (!resourceTitle.trim()) {
        toast.warning("Please enter a resource title");
        return;
      }

      if (resourceFile) {
        const formData = new FormData();
        formData.append("file", resourceFile);
        try {
          const response = await UploadResource(formData).unwrap();
          if (response.success) {
            toast.success(
              response.message || "Resource file uploaded successfully"
            );
            const uploadedUrl = response?.result?.url || "";
            dispatch(setPreviewResourceFile(uploadedUrl));
            dispatch(setResourceType(finalType));
            dispatch(setResourceTitle(resourceTitle.trim()));
            dispatch(setResourceDescription(finalDescription));
            dispatch(setResourceLink(resourceLink.trim()));
            dispatch(setActiveBookTab("grade"));
          }
        } catch (error) {
          toast.warning(
            (error as any)?.data?.message || "Something went wrong while uploading"
          );
        }
      } else if (resourceLink.trim()) {
        dispatch(setPreviewResourceFile(""));
        dispatch(setResourceFile(null));
        dispatch(setResourceType(finalType));
        dispatch(setResourceTitle(resourceTitle.trim()));
        dispatch(setResourceDescription(finalDescription));
        dispatch(setResourceLink(resourceLink.trim()));
        dispatch(setActiveBookTab("grade"));
      } else if (previewResourceUrl) {
        dispatch(setResourceType(finalType));
        dispatch(setResourceTitle(resourceTitle.trim()));
        dispatch(setResourceDescription(finalDescription));
        dispatch(setActiveBookTab("grade"));
      } else {
        toast.warning("Please attach a file or provide a link");
      }
    }
  };

  const displayedFileName =
    resourceFile?.name ||
    (previewResourceUrl
      ? previewResourceUrl.split("/").pop() || "Uploaded Resource"
      : "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload New Resource</h2>
          <p className="text-sm text-[#636F85] mt-1">
            {isOverview
              ? "Add supplementary materials or files to this book"
              : "Add supplementary materials or files to this book (optional)"}
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
                onClick={() => handleTypeSelect(item.type, false)}
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
                    isSelected
                      ? "border-[#1E3A8A] bg-[#1E3A8A]"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label className="block text-sm font-semibold text-[#30373D] mb-1.5">
          Resource Title{" "}
          {isOverview && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="text"
          placeholder="e.g., Chapter 1 Summary & Exercises"
          value={resourceTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="border-[#CBD5E1] focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] rounded-lg"
          required={isOverview}
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
          onChange={(e) => handleDescriptionChange(e.target.value)}
        />
      </div>

      {/* File Upload or Link */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="block text-sm font-semibold text-[#30373D]">
              Attach File
            </Label>
            {(resourceFile || previewResourceUrl) && (
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

          {!resourceFile && !previewResourceUrl ? (
            <label
              className="cursor-pointer block"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept={acceptAttribute}
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={`border-2 border-dashed rounded-xl flex flex-col justify-center items-center w-full p-6 transition-colors ${
                  isDragging
                    ? "border-[#1E3A8A] bg-[#F0F4FF]"
                    : "border-gray-300 hover:border-[#1E3A8A] bg-gray-50/50 hover:bg-[#F0F4FF]/40"
                }`}
              >
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
            <div className="border-2 border-[#1E3A8A]/30 bg-[#F0F4FF] rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                  {isImage && previewSource ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 bg-white shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src={previewSource}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
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
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-xs md:max-w-md">
                        {displayedFileName}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800 shrink-0">
                        {resourceFile ? "Selected" : "Uploaded"}
                      </span>
                    </div>
                    {resourceFile && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(resourceFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
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

              {/* Visual Preview for Images */}
              {isImage && previewSource && (
                <div className="pt-3 border-t border-[#1E3A8A]/15">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white p-2 flex items-center justify-center max-h-72">
                    <img
                      src={previewSource}
                      alt={displayedFileName || "Image Preview"}
                      className="max-h-64 max-w-full w-auto object-contain rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Visual Preview for Audio */}
              {isAudio && previewSource && (
                <div className="pt-3 border-t border-[#1E3A8A]/15">
                  <audio controls src={previewSource} className="w-full h-10 rounded-md" />
                </div>
              )}

              {/* Visual Preview for Video */}
              {isVideo && previewSource && (
                <div className="pt-3 border-t border-[#1E3A8A]/15">
                  <video
                    controls
                    src={previewSource}
                    className="max-h-64 max-w-full w-auto mx-auto rounded-md shadow-xs bg-black"
                  />
                </div>
              )}
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
          {!resourceFile && !previewResourceUrl && resourceLink && isImage && (
            <div className="mt-3 p-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center max-h-64">
              <img
                src={resourceLink}
                alt="Link Preview"
                className="max-h-60 max-w-full object-contain rounded-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
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

        {!isOverview &&
          !resourceTitle.trim() &&
          !resourceFile &&
          !resourceLink.trim() &&
          !previewResourceUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(setActiveBookTab("grade"))}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer flex items-center gap-1.5"
            >
              Skip
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

        <Button
          type="submit"
          disabled={isButtonDisabled || isResourceLoading}
          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium px-8 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResourceLoading ? (
            <div className="flex items-center gap-2">
              <PiSpinner className="animate-spin h-4 w-4" />
              <span>{isOverview ? "Uploading..." : "Saving..."}</span>
            </div>
          ) : isOverview ? (
            "Upload Resource"
          ) : (
            "Save & Continue"
          )}
        </Button>
      </div>
    </form>
  );
};

export default Resource;