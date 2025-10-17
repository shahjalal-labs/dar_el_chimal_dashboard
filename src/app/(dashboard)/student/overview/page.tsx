"use client";

import anoucement from "@/assets/student/anoucment.png";
import assignment from "@/assets/student/assignments.png";
import book from "@/assets/student/book.png";
import link from "@/assets/student/link-04.png";
import StatCard from "@/components/Student/Overview/StatCard";
import { useGetStudentOverviewQuery } from "@/redux/api/student/overviewApi";

export default function Home() {
  const { data: overviewData } = useGetStudentOverviewQuery({});
  console.log("data overview", overviewData);

  const studentOverviewData = overviewData?.result;
  const TotalBooks = studentOverviewData?.TotalBooks;
  const TotalAssignment = studentOverviewData?.TotalAssignment;
  const TotalAnnouncment = studentOverviewData?.TotalAnnouncment;
  const TotalResources = studentOverviewData?.TotalResources;

  return (
    <main className="bg-white p-6 md:p-12 rounded-2xl">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-[32px] font-bold text-black mb-8 md:mb-12 text-balance">
          Let's see what's on your learning list today
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <StatCard
            label="Total Books"
            number={TotalBooks}
            bgColor="bg-[#F1E7FF]"
            iconBgColor="bg-[#AE7BF51A]"
            icon={book}
            params="books"
          />
          <StatCard
            label="Announcements"
            number={TotalAnnouncment}
            bgColor="bg-[#EBFDEF]"
            iconBgColor="bg-[#71C8FF1A]"
            icon={anoucement}
            params="announcments"
          />
          <StatCard
            label="Total Resources"
            number={TotalResources}
            bgColor="bg-[#E7EFFF]"
            iconBgColor="bg-[#3471EB1A]"
            icon={link}
            // No params => static card
          />
          <StatCard
            label="Total Assignment"
            number={TotalAssignment}
            bgColor="bg-[#FFEFE7]"
            iconBgColor="bg-[#FF9D6B1A]"
            icon={assignment}
            params="assignments"
          />
        </div>
      </div>
    </main>
  );
}
