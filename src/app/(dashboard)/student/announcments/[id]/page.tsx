import { AnnouncementDetail } from "@/components/Student/Announcments/AnnouncementDetail";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  date: string;
  title: string;
  seenCount: number;
  content: string;
}

const announcements: Announcement[] = [
  {
    id: "1",
    date: "June 15, 2025",
    title: "Reminder: Quiz on Thursday!",
    seenCount: 21,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "2",
    date: "June 15, 2025",
    title: "Bring Workbooks Tomorrow",
    seenCount: 18,
    content:
      "Please remember to bring your workbooks tomorrow for the class activity. We will be working on collaborative projects.",
  },
  {
    id: "3",
    date: "June 15, 2025",
    title: "Great Job Everyone!",
    seenCount: 21,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "4",
    date: "June 15, 2025",
    title: "Reminder: Quiz on Monday!",
    seenCount: 15,
    content:
      "Another quiz is coming up on Monday. Make sure to review chapters 5-8 before class.",
  },
];

export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const announcement = announcements.find((a) => a.id === params.id);

  if (!announcement) {
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
          title={announcement.title}
          date={announcement.date}
          seenCount={announcement.seenCount}
          content={announcement.content}
        />
      </div>
    </main>
  );
}
