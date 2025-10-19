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

  const { data: getAnnouncments } =
    useGetStudentDetailsQuery(queryField);
  const announcmentsData: Announcement[] =
    getAnnouncments?.result?.announcments ?? [];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8">
          Announcement List
        </h1>

        <div className="">
          {announcmentsData.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              id={announcement.id}
              date={announcement.postdate}
              title={announcement.title}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
