// import React from 'react';

import { useGetAdminOverviewQuery } from "@/redux/api/admin";
import DashboardStat from "./DashboardStat";
import RevenueChart from "./RevenueChart";
import { useState } from "react";
import StudentTable from "./StudentTable";
import TeacherRingChart from "./TeacherRingChart";

const AdminStat = () => {
  const [revenueYear, setRevenueYear] = useState("");

  const { data: adminOverviewData } = useGetAdminOverviewQuery(revenueYear);

  return (
    <div>
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
    </div>
  );
};

export default AdminStat;
