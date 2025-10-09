import { baseApi } from "../baseApi";

export const statApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStat: builder.query({
            query: () => ({
                url: `/users/admin-overview-statistics`,
                method: 'GET'
            }),
            providesTags: ["admin"]
        }),
        getAdminOverview: builder.query({
            query: (revenueYear) => ({
                url: `/users/admin-overview?type=${revenueYear}`,
                method: 'GET'
            }),
            providesTags: ["admin"]
        }),
    })
})

export const {
    useGetAdminStatQuery,
    useGetAdminOverviewQuery
} = statApi;