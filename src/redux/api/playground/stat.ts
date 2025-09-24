import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroundStat: builder.query({
            query: () => ({
                url: `/summary/practice-ground`,
                method: 'GET'
            }),
            providesTags: ['ground']
        }),
        getGroundRevenue: builder.query({
            query: (revenueYear) => ({
                url: `/summary/practice-ground/monthly-revenue?year=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ['ground']
        }),
        getTopCustomers: builder.query({
            query: () => ({
                url: `/summary/practice-ground/top-customer`,
                method: 'GET'
            }),
            providesTags: ['ground']
        }),
        getOrderChart: builder.query({
            query: () => ({
                url: `/summary/practice-ground/order-chat`,
                method: 'GET'
            }),
            providesTags: ['ground']
        })
    })
})

export const { useGetGroundStatQuery, useGetGroundRevenueQuery, useGetTopCustomersQuery, useGetOrderChartQuery } = statApi;