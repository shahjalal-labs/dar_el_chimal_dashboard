"use client";

import { AnnouncementCard } from "@/components/Student/Announcments/AnnouncementCard";
import { useGetStudentDetailsQuery } from "@/redux/api/student/overviewApi";
import { usePathname } from "next/navigation";

interface Announcement {
  id: string;
  postdate: string;
  title: string;
  seenCount: number;
  content: string;
}

export default function AnnouncementPage() {
  const pathname = usePathname();
  const queryField = pathname.split("/").pop();

  // ✅ Extract loading & error states from RTK Query
  const {
    data: getAnnouncments,
    isLoading,
    isError,
  } = useGetStudentDetailsQuery(queryField);

  const announcmentsData: Announcement[] =
    getAnnouncments?.result?.announcments ?? [];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8">
          Announcement List
        </h1>

        {/* ✅ Show loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading...</span>
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center py-10">
            Failed to load announcements. Please try again.
          </p>
        ) : announcmentsData.length === 0 ? (
          // ✅ Show "no data" message
          <p className="text-center text-muted-foreground py-10">
            No announcements available.
          </p>
        ) : (
          // ✅ Render announcements
          <div>
            {announcmentsData.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                id={announcement.id}
                date={announcement.postdate}
                title={announcement.title}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
