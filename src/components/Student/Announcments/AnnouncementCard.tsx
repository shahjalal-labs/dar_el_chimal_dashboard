import calender from "@/assets/student/calender.png";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AnnouncementCardProps {
  id: string;
  date: string;
  title: string;
}

export function AnnouncementCard({ id, date, title }: AnnouncementCardProps) {
  // ✅ Format the date properly
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/student/announcments/${id}`}>
      <div className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 bg-[#F7F9FF] border border-border rounded-lg hover:bg-muted transition-colors mb-4">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Image
              src={calender}
              className="w-[18px] h-[18px] object-contain"
              alt="calendar icon"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formattedDate}
              </p>
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate sm:truncate pt-2">
            {title}
          </h3>
        </div>
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground flex-shrink-0" />
      </div>
    </Link>
  );
}
