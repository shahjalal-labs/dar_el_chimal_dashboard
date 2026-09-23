"use client";

import { useGetBookDetailsQuery } from "@/redux/api/student/booksApi";
import { ChevronRight, FileText, Link2, Music, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReactNextPlayer } from "reactnextplayer";

interface Attachment {
  id: string;
  type: "Audio" | "Video" | "Pdf" | "Image";
  title: string;
  date: string;
  onClick?: () => void;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  Type: "Audio" | "Video" | "Pdf" | "Image";
  file: string;
  bookId: string;
  uplodedBy: string;
  uploderName: string;
  createdAt: string;
  updatedAt: string;
}

interface AttachmentsProps {
  attachments?: Attachment[];
  onAttachmentClick?: (attachment: Attachment, resources: Resource[]) => void;
  bookId: string;
}

export default function Attachments({
  attachments = [
    { id: "1", type: "Audio", title: "Audio", date: "June 10, 2025" },
    { id: "2", type: "Video", title: "Video", date: "June 10, 2025" },
    { id: "3", type: "Pdf", title: "PDF", date: "June 10, 2025" },
    { id: "4", type: "Image", title: "Images", date: "June 10, 2025" },
  ],
  onAttachmentClick,
  bookId,
}: AttachmentsProps) {
  const [selectedType, setSelectedType] = useState<
    "Audio" | "Video" | "Pdf" | "Image" | null
  >(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: getBooksOverview } = useGetBookDetailsQuery(bookId);

  const getIconConfig = (type: "Audio" | "Video" | "Pdf" | "Image") => {
    switch (type) {
      case "Audio":
        return {
          icon: Music,
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
        };
      case "Video":
        return {
          icon: Link2,
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
        };
      case "Pdf":
        return {
          icon: FileText,
          bgColor: "bg-orange-100",
          iconColor: "text-orange-600",
        };
      case "Image":
        return {
          icon: ImageIcon,
          bgColor: "bg-purple-100",
          iconColor: "text-purple-600",
        };
    }
  };

  // Filter resources based on selected type
  const filteredResources =
    getBooksOverview?.result?.Resources?.filter((resource: Resource) => {
      if (!selectedType) return false;
      return resource.Type === selectedType;
    }) || [];

  // Count resources by type for the header
  const getResourceCountByType = (type: "Audio" | "Video" | "Pdf" | "Image") => {
    return (
      getBooksOverview?.result?.Resources?.filter(
        (resource: Resource) => resource.Type === type
      ).length || 0
    );
  };

  const handleAttachmentClick = (attachment: Attachment) => {
    const resourcesForType =
      getBooksOverview?.result?.Resources?.filter(
        (resource: Resource) => resource.Type === attachment.type
      ) || [];

    setSelectedType(attachment.type);
    onAttachmentClick?.(attachment, resourcesForType);
  };

  const handleBackToTypes = () => {
    setSelectedType(null);
  };

  const router = useRouter();
  const handleViewResource = (resource: Resource) => {
    if (resource.Type === "Pdf") {
      // Open PDF in new tab
      // window.open(resource.file, "_blank");
      router.push(`/student/books/read?pdfurl=${encodeURIComponent(resource.file)}`);
    } else {
      // Open Audio/Video in modal
      setSelectedResource(resource);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  // Update attachments with actual counts from API
  const actualAttachments = attachments.map((attachment) => ({
    ...attachment,
    count: getResourceCountByType(attachment.type),
  }));

  // Show filtered resources when a type is selected
  if (selectedType) {
    return (
      <>
        <div className="space-y-6 bg-white p-5 rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToTypes}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 rotate-180" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedType} Resources ({filteredResources.length})
              </h2>
            </div>
          </div>

          {/* Resources List */}
          {filteredResources.length > 0 ? (
            <div className="space-y-3">
              {filteredResources.map((resource: Resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 bg-[#F7F9FFCC] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {resource.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded:{" "}
                      {new Date(resource.createdAt).toLocaleDateString()} • By:{" "}
                      {resource.uploderName || resource.uplodedBy}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewResource(resource)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-lg ${selectedType === "Audio"
                  ? "bg-red-100"
                  : selectedType === "Video"
                    ? "bg-green-100"
                    : "bg-orange-100"
                  }`}
              >
                {selectedType === "Audio" && (
                  <Music className="h-8 w-8 text-red-600" />
                )}
                {selectedType === "Video" && (
                  <Link2 className="h-8 w-8 text-green-600" />
                )}
                {selectedType === "Pdf" && (
                  <FileText className="h-8 w-8 text-orange-600" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No {selectedType} Resources
              </h3>
              <p className="mt-2 text-gray-500">
                No {selectedType.toLowerCase()} files found for this book.
              </p>
            </div>
          )}
        </div>

        {/* Audio/Video Modal */}
        {isModalOpen && selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-end items-center p-6 ">
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedResource.Type === "Video" && (
                  <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <ReactNextPlayer
                      src={selectedResource.file}
                      // poster="/poster-image.jpg"
                      autoplay={false}
                      controls
                      color="#ff4757"
                      onPlay={() => console.log("Video started")}
                      onPause={() => console.log("Video paused")}
                      onEnded={() => console.log("Video ended")}
                      onTimeUpdate={(t) => console.log("Current time:", t)}
                    />
                  </div>
                )}

                {selectedResource.Type === "Audio" && (
                  <div className="w-full p-6 bg-gray-100 rounded-lg">
                    <div className="max-w-md mx-auto">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <Music className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {selectedResource.title}
                          </h4>
                          <p className="text-sm text-gray-600">Audio File</p>
                        </div>
                      </div>
                      <audio controls className="w-full" autoPlay>
                        <source src={selectedResource.file} type="audio/mpeg" />
                        <source src={selectedResource.file} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {selectedResource.Type === "Image" && (
                  <div className="flex flex-col items-center justify-center p-2">
                    <img
                      src={selectedResource.file}
                      alt={selectedResource.title}
                      className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-4">{selectedResource.title}</p>
                    {selectedResource.description && (
                      <p className="text-xs text-gray-500 mt-1">{selectedResource.description}</p>
                    )}
                  </div>
                )}

                {/* File Info */}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Show type selection buttons when no type is selected
  return (
    <div className="space-y-6 bg-white p-5 rounded-2xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Total Attachment: 3
        </h2>
      </div>

      {/* Type Filter buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        {actualAttachments.map((attachment) => {
          const config = getIconConfig(attachment.type);
          const IconComponent = config.icon;

          return (
            <button
              key={attachment.id}
              onClick={() => handleAttachmentClick(attachment)}
              className="group flex items-center gap-4 rounded-lg border border-[#D8D8D880] bg-[#F7F9FFCC] p-4 transition-all hover:border-gray-300 hover:shadow-md active:scale-95"
            >
              {/* Icon Container */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.bgColor}`}
              >
                <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">
                  {attachment.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {attachment.count} items
                </p>
              </div>

              {/* Chevron */}
              <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
