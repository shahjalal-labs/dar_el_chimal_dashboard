import calender from "@/assets/student/calender.png";
import Image from "next/image";

interface AnnouncementDetailProps {
  title: string;
  date: string;
  content: string;
}

export function AnnouncementDetail({
  title,
  date,
  content,
}: AnnouncementDetailProps) {
  // Format date → June 10, 2025
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
        {title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image
            src={calender}
            alt="calender"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>{formattedDate}</span>
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
        {content}
      </p>
    </div>
  );
}
