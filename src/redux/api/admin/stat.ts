import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStat: builder.query({
            query: () => ({
                url: `/users/admin-overview-statistics`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getAdminOverview: builder.query({
            query: (revenueYear) => ({
                url: `/users/admin-overview?type=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ['admin']
        }),
        getAllStudents: builder.query({
            query: () => ({
                url: `/users/get-students`,
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

export const { useGetAdminStatQuery, useGetAdminOverviewQuery, useGetAllStudentsQuery, useGetAdminOrderChartQuery, useGetTransactionListQuery, useGetBookingListQuery } = statApi;