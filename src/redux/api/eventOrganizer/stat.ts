import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEventStat: builder.query({
            query: () => ({
                url: `/summary/event`,
                method: 'GET'
            }),
            providesTags: ['event']
        }),
        getEventRevenue: builder.query({
            query: (revenueYear) => ({
                url: `/summary/event/monthly-revenue?year=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ['event']
        }),
        getEventTopCustomers: builder.query({
            query: () => ({
                url: `/summary/event/top-customer`,
                method: 'GET'
            }),
            providesTags: ['event']
        }),
        getEventOrderChart: builder.query({
            query: () => ({
                url: `/summary/event/order-chat`,
                method: 'GET'
            }),
            providesTags: ['event']
        })
    })
})

export const { useGetEventStatQuery, useGetEventRevenueQuery, useGetEventTopCustomersQuery, useGetEventOrderChartQuery } = statApi;