/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DashboardStat from "./DashboardStat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import RevenueChart from "./RevenueChart";
import { useGetAdminOverviewQuery } from "@/redux/api/admin";
import TeacherRingChart from "./TeacherRingChart";
import StudentTable from "./StudentTable";
import { useGetTeacherOverviewQuery } from "@/redux/api/teacher/overviewApi";
import assignedBooks from '@/assets/assignedBooks.svg';
import activeStudents from "@/assets/activeStudents.svg";
import Image from "next/image";
import { SlCalender } from "react-icons/sl";
import { BiBookReader } from "react-icons/bi";
import { TfiAngleRight } from "react-icons/tfi";
import Link from "next/link";
import { Button } from "../ui/button";

const DashboardLayout = () => {
  const [revenueYear, setRevenueYear] = useState("");
  const authState = useSelector((state: RootState) => state.auth);

  const { data: adminOverviewData } = useGetAdminOverviewQuery(revenueYear);
  const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);

  return (
    <>
      {
        authState?.role === 'Admin' ?
          <div>
            <DashboardStat />
            <div>
              <div className="xl:flex gap-6 my-6">
                <div className="xl:w-2/3">
                  <RevenueChart
                    data={adminOverviewData?.result}
                    revenueYear={revenueYear}
                    setRevenueYear={setRevenueYear}
                  />
                </div>
                <div className="xl:w-1/3 h-full mt-6 xl:mt-0">
                  <TeacherRingChart />
                </div>
              </div>
              <StudentTable />
            </div>
          </div> :
          <div className="p-8 rounded-lg bg-[#FFFFFF]">
            <h2 className="text-2xl font-medium">
              Here’s what’s happening in your classroom today
            </h2>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 my-12">
              <div className="bg-[#AF9CE4] px-6 py-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-lg text-[#FFFFFFCC]">Assigned Books</p>
                  <p className="text-[56px] font-bold text-white">{teacherOverviewData?.result?.assignBooks}</p>
                </div>
                <div className="bg-[#FFFFFF29] p-4 rounded-full">
                  <Image
                    src={assignedBooks}
                    height={50}
                    width={50}
                    alt="Image"
                    className="w-10 h-10"
                    priority
                  />
                </div>
              </div>

              <div className="bg-[#FC7391] px-6 py-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-lg text-[#FFFFFFCC]">Active Students</p>
                  <p className="text-[56px] font-bold text-white">{teacherOverviewData?.result?.activeStudents}</p>
                </div>
                <div className="bg-[#FFFFFF29] p-4 rounded-full">
                  <Image
                    src={activeStudents}
                    height={50}
                    width={50}
                    alt="Image"
                    className="w-10 h-10"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* My Classes */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">My Classes</h3>
              <Link href='/teacher/classes'>
                <Button variant="default" className="font-medium hover:underline bg-gray-50 text-black hover:text-white">See All</Button>
              </Link>
            </div>

            <div className="space-y-3">
              {teacherOverviewData?.result?.grades?.slice(0, 5).map((grade: any) => (
                <Link
                  href={`/teacher/classes/${grade?.id}`}
                  key={grade?.id}
                  className="bg-[#F7F9FF] border border-[#D8D8D8] rounded-lg p-5 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-xl">
                      {grade?.grade} - Section A
                    </p>
                    <p className="md:flex items-center gap-4 text-[#4C4C4C] mt-3">
                      <div className="flex items-center gap-2"><BiBookReader className="text-lg" /> {grade?.totalStudents} Student{grade?.totalStudents > 1 ? "s" : ""}</div>
                      <div className="flex items-center gap-2"><SlCalender className="text-lg" /> {new Date().getFullYear()}</div>
                    </p>
                  </div>
                  <span className="text-[#1C1B1F]"><TfiAngleRight className="w-6 h-6" /></span>
                </Link>
              ))}
            </div>
          </div>
      }
    </>
  );
};

export default DashboardLayout;
