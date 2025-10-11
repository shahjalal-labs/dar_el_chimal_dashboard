"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice";
import one from '@/assets/adminStatOne.svg';
import two from '@/assets/adminStatTwo.svg';
import three from '@/assets/adminStatThree.svg';
import four from '@/assets/adminStatFour.svg';
import { useGetAdminStatQuery } from "@/redux/api/admin";

const DashboardStat = () => {
  const authState = useSelector(useAuth);
  const { data: adminStat } = useGetAdminStatQuery(undefined);

  const stats =
    authState.role === "Admin" ?
      [
        { metric: "Total School", img: one, value: adminStat?.result?.totalSchool, background: "#FFEFE7" },
        { metric: "Total Teachers", img: two, value: adminStat?.result?.totalTeacher, background: "#E5F5FF" },
        { metric: "Total Students", img: three, value: adminStat?.result?.totalStudent, background: "#F1E7FF" },
        { metric: "Total Books", img: four, value: adminStat?.result?.totalBooks, background: "#EBFDEF" },
      ] :
      authState.role === "Student" ?
        [
        ] :
        [
        ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats?.map((stat, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center rounded-2xl p-5"
          style={{ backgroundColor: stat.background }}
        >
          <div>
            <h1 className="font-medium text-[#79767B]">{stat.metric}</h1>
            <p className="text-3xl font-semibold">{stat.value}</p>
          </div>
          <div>
            <Image
              src={stat.img}
              alt={stat.metric}
              height={100}
              width={100}
              className="h-10 w-10"
              priority
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStat;
