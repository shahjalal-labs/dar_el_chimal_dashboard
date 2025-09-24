import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStat: builder.query({
            query: () => ({
                url: `/admin-summery`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getAdminRevenue: builder.query({
            query: (revenueYear) => ({
                url: `/admin-summery/monthly-revenue?year=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getTopVendors: builder.query({
            query: () => ({
                url: `/admin-summery/top-vendor`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getAdminOrderChart: builder.query({
            query: () => ({
                url: `/admin-summery/order-chart`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getTransactionList: builder.query({
            query: () => ({
                url: `/admin-summery/transaction-list`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getBookingList: builder.query({
            query: ({ currentPage, category }) => ({
                url: `/admin-summery/bookings-list?category=${category}&page=${currentPage}`,
                method: 'GET'
            }),
            providesTags: ['admin']
        })
    })
})

export const { useGetAdminStatQuery, useGetAdminRevenueQuery, useGetTopVendorsQuery, useGetAdminOrderChartQuery, useGetTransactionListQuery, useGetBookingListQuery } = statApi;