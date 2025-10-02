"use client";

import React, { useState } from "react";
import DashboardStat from "./DashboardStat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import RevenueChart from "./RevenueChart";
import { useGetGroundRevenueQuery } from "@/redux/api/playground/stat";
import BookingList from "./BookingList";
import TopCustomersTable from "./TopCustomersTable";
import { useGetEventRevenueQuery } from "@/redux/api/eventOrganizer/stat";
import { useGetAllPlayGroundBookingQuery } from "@/redux/api/playground/booking";
import { useGetAllEventBookingsQuery } from "@/redux/api/eventOrganizer/booking";
import { useGetEcommerceRevenueQuery } from "@/redux/api/ecommerce/stat";
import { useGetAdminOverviewQuery, useGetTransactionListQuery } from "@/redux/api/admin/stat";
import OrderChart from "./OrderChart";
import { useGetAllEcommerceBookingsQuery } from "@/redux/api/ecommerce/booking";
import TransactionList from "./TransactionList";
import TeacherRingChart from "./TeacherRingChart";

const DashboardLayout = () => {
  const [revenueYear, setRevenueYear] = useState("");
  const authState = useSelector((state: RootState) => state.auth);

  const { data } = useGetGroundRevenueQuery(revenueYear);
  const { data: revenueData } = useGetEventRevenueQuery(revenueYear);
  const { data: ecommerceRevenueData } = useGetEcommerceRevenueQuery(revenueYear);
  const { data: adminOverviewData } = useGetAdminOverviewQuery(revenueYear);

  const { data: groundBooking } = useGetAllPlayGroundBookingQuery(1);
  const { data: eventBooking } = useGetAllEventBookingsQuery(1);
  const { data: ecommerceBooking } = useGetAllEcommerceBookingsQuery(1);
  const { data: transactionsList } = useGetTransactionListQuery(1);

  return (
    <div>
      <DashboardStat />
      <div>
        <div className="flex gap-6 my-6">
          <div className="w-2/3">
            <RevenueChart
              data={authState.role === "Admin" ? adminOverviewData?.result : authState.role === "Student" ? ecommerceRevenueData?.result : revenueData?.result}
              revenueYear={revenueYear}
              setRevenueYear={setRevenueYear}
            />
          </div>
          <div className="w-1/3 h-full">
            <TeacherRingChart />
          </div>
        </div>
        <TopCustomersTable />
      </div>
    </div>
  );
};

export default DashboardLayout;
