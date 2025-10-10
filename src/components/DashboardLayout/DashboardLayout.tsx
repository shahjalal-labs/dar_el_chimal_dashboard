"use client";

import React, { useState } from "react";
import DashboardStat from "./DashboardStat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import RevenueChart from "./RevenueChart";
import { useGetAdminOverviewQuery } from "@/redux/api/admin/stat";
import TeacherRingChart from "./TeacherRingChart";
import StudentTable from "./StudentTable";

const DashboardLayout = () => {
  const [revenueYear, setRevenueYear] = useState("");
  const authState = useSelector((state: RootState) => state.auth);

  console.log(authState);

  const { data: adminOverviewData } = useGetAdminOverviewQuery(revenueYear);

  return (
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
    </div>
  );
};

export default DashboardLayout;
