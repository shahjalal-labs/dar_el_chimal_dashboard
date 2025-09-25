"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice";
// import one from '@/assets/chart.svg'
// import two from '@/assets/chart (1).svg'
// import three from '@/assets/chart (2).svg'
// import four from '@/assets/chart (3).svg'
import { useGetGroundStatQuery } from "@/redux/api/playground/stat";
import { useGetEventStatQuery } from "@/redux/api/eventOrganizer/stat";
import { useGetEcommerceStatQuery } from "@/redux/api/ecommerce/stat";
import { useGetAdminStatQuery } from "@/redux/api/admin/stat";

const DashboardStat = () => {
  const authState = useSelector(useAuth);
  const { data } = useGetGroundStatQuery(undefined);
  const { data: eventStat } = useGetEventStatQuery(undefined);
  const { data: ecommerceStat } = useGetEcommerceStatQuery(undefined);
  const { data: adminStat } = useGetAdminStatQuery(undefined);

  // const stats =
  //   authState.role === "ADMIN" ?
  //     [
  //       { metric: "Total Earnings", img: one, value: adminStat?.result?.totalEarning, change: "+20%" },
  //       { metric: "Total Playground Bookings", img: two, value: adminStat?.result?.totalPracticeGroundBooking, change: "+20%" },
  //       { metric: "Total Event Bookings", img: three, value: adminStat?.result?.totalEventBooking, change: "+20%" },
  //       { metric: "Total Ecommerce Bookings", img: four, value: adminStat?.result?.totalECommerceBooking, change: "+20%" },
  //       { metric: "Total Users", img: four, value: adminStat?.result?.totalUsers, change: "-5%" },
  //       { metric: "Total Vendors", img: three, value: adminStat?.result?.totalVendors, change: "+10%" },
  //       { metric: "Total Stores", img: two, value: adminStat?.result?.totalStores, change: "+10%" },
  //       { metric: "Total Events", img: one, value: adminStat?.result?.totalEvents, change: "+10%" },
  //       { metric: "Total Practice Grounds", img: one, value: adminStat?.result?.totalPracticeGround, change: "+10%" },
  //       { metric: "Total Products", img: two, value: adminStat?.result?.totalProducts, change: "+10%" },
  //     ] :
  //     authState.businessCategory === "E_COMMERCE" ?
  //       [
  //         { metric: "Total Earnings", img: one, value: ecommerceStat?.result?.totalEarning, change: "+20%" },
  //         { metric: "Complete Booking", img: two, value: ecommerceStat?.result?.totalCompleteBooking, change: "-5%" },
  //         { metric: "Active Booking", img: three, value: ecommerceStat?.result?.totalActiveBooking, change: "+10%" },
  //         { metric: "Pending Booking", img: four, value: ecommerceStat?.result?.totalPendingBooking, change: "-15%" },
  //       ] :
  //       authState.businessCategory === "EVENT" ?
  //         [
  //           { metric: "Total Earnings", img: one, value: eventStat?.result?.totalEarning, change: "+20%" },
  //           { metric: "Complete Order", img: two, value: eventStat?.result?.totalCompleteBooking, change: "-5%" },
  //           { metric: "Booking Order", img: three, value: eventStat?.result?.totalActiveBooking, change: "+10%" },
  //           { metric: "Pending Order", img: four, value: eventStat?.result?.totalPendingBooking, change: "-15%" },
  //         ] :
  //         [
  //           { metric: "Total Earnings", img: one, value: data?.result?.totalEarning, change: "+20%" },
  //           { metric: "Complete Booking", img: two, value: data?.result?.totalCompleteBooking, change: "-5%" },
  //           { metric: "Active Booking", img: three, value: data?.result?.totalActiveBooking, change: "+10%" },
  //           { metric: "Pending Booking", img: four, value: data?.result?.totalPendingBooking, change: "-15%" },
  //         ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    </div>
  );
};

export default DashboardStat;
