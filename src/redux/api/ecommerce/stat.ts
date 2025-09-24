import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEcommerceStat: builder.query({
            query: () => ({
                url: `/summary/e-commerce`,
                method: 'GET'
            }),
            providesTags: ['ecommerce']
        }),
        getEcommerceRevenue: builder.query({
            query: (revenueYear) => ({
                url: `/summary/e-commerce/monthly-revenue?year=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ['ecommerce']
        }),
        getEcommerceTopCustomers: builder.query({
            query: () => ({
                url: `/summary/e-commerce/top-customer`,
                method: 'GET'
            }),
            providesTags: ['ecommerce']
        }),
        getEcommerceOrderChart: builder.query({
            query: () => ({
                url: `/summary/e-commerce/order-chat`,
                method: 'GET'
            }),
            providesTags: ['ecommerce']
        })
    })
})

export const { useGetEcommerceStatQuery, useGetEcommerceRevenueQuery, useGetEcommerceTopCustomersQuery, useGetEcommerceOrderChartQuery } = statApi;