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
import { useGetAdminRevenueQuery, useGetTransactionListQuery } from "@/redux/api/admin/stat";
import OrderChart from "./OrderChart";
import { useGetAllEcommerceBookingsQuery } from "@/redux/api/ecommerce/booking";
import TransactionList from "./TransactionList";

const DashboardLayout = () => {
  const [revenueYear, setRevenueYear] = useState("");
  const authState = useSelector((state: RootState) => state.auth);

  const { data } = useGetGroundRevenueQuery(revenueYear);
  const { data: revenueData } = useGetEventRevenueQuery(revenueYear);
  const { data: ecommerceRevenueData } = useGetEcommerceRevenueQuery(revenueYear);
  const { data: adminRevenueData } = useGetAdminRevenueQuery(revenueYear);

  const { data: groundBooking } = useGetAllPlayGroundBookingQuery(1);
  const { data: eventBooking } = useGetAllEventBookingsQuery(1);
  const { data: ecommerceBooking } = useGetAllEcommerceBookingsQuery(1);
  const { data: transactionsList } = useGetTransactionListQuery(1);

  return (
    <div>
      <DashboardStat />
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="col-span-1 xl:col-span-2 space-y-6">
            <RevenueChart
              data={authState.role === "ADMIN" ? adminRevenueData?.result : authState.businessCategory === "E_COMMERCE" ? ecommerceRevenueData?.result : authState.businessCategory === "EVENT" ? revenueData?.result : data?.result}
              revenueYear={revenueYear}
              setRevenueYear={setRevenueYear}
            />
            <TopCustomersTable />
          </div>
          <div className="col-span-1 xl:col-span-1 space-y-6">
            {
              authState.role === "ADMIN" ?
                <TransactionList
                  data={transactionsList?.result?.data}
                /> :
                <BookingList
                  data={authState.businessCategory === "E_COMMERCE" ? ecommerceBooking?.result?.bookings : authState.businessCategory === "EVENT" ? eventBooking?.result?.bookings : groundBooking?.result?.bookings}
                />
            }
            <OrderChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
          </div>
          <div className="col-span-1">
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
