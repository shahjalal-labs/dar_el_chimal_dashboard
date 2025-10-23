"use client";
import { AnnouncementDetail } from "@/components/Student/Announcments/AnnouncementDetail";
import { useGetAnnouncementDetailsQuery } from "@/redux/api/student/overviewApi";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";



export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params?.id;

  const { data: announcementDetails } = useGetAnnouncementDetailsQuery(id);
  const announcementData = announcementDetails?.result;

  console.log("data in announcement", announcementDetails);

  if (!announcementData) {
    return (
      <main className=" p-4 ">
        <div className="">
          <Link
            href="/student/announcments"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Announcements
          </Link>
          <p className="max-w-2xl mx-auto font-bold text-center mt-10 text-red-500">
            Announcement not found
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className=" p-4 sm:p-6 lg:p-8">
      <div className="">
        <Link
          href="/student/announcments"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Announcements
        </Link>
        <AnnouncementDetail
          title={announcementData.title}
          date={announcementData.postdate}
          content={announcementData.anouncement}
        />
      </div>
    </main>
  );
}
