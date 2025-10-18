"use client";

import { ChevronRight, FileText, Link2, Music } from "lucide-react";

interface Attachment {
  id: string;
  type: "audio" | "video" | "pdf";
  title: string;
  date: string;
  onClick?: () => void;
}

interface AttachmentsProps {
  attachments?: Attachment[];
  onAttachmentClick?: (attachment: Attachment) => void;
}

export default function Attachments({
  attachments = [
    { id: "1", type: "audio", title: "Audio", date: "June 10, 2025" },
    { id: "2", type: "video", title: "Video", date: "June 10, 2025" },
    { id: "3", type: "pdf", title: "PDF", date: "June 10, 2025" },
  ],
  onAttachmentClick,
}: AttachmentsProps) {
  const getIconConfig = (type: "audio" | "video" | "pdf") => {
    switch (type) {
      case "audio":
        return {
          icon: Music,
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
        };
      case "video":
        return {
          icon: Link2,
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
        };
      case "pdf":
        return {
          icon: FileText,
          bgColor: "bg-orange-100",
          iconColor: "text-orange-600",
        };
    }
  };

  return (
    <div className="space-y-6 bg-white p-5 rounded-2xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Total Attachment: {attachments.length}
        </h2>
      </div>

      {/* Attachments Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {attachments.map((attachment) => {
          const config = getIconConfig(attachment.type);
          const IconComponent = config.icon;

          return (
            <button
              key={attachment.id}
              onClick={() => onAttachmentClick?.(attachment)}
              className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md active:scale-95"
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
                <p className="text-sm text-gray-600">{attachment.date}</p>
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
