import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
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
        getAllTeachersByAdmin: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/users/get-teachers?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["teacher"],
        }),
        getAllStudentsByAdmin: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/users/get-students?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["student"],
        }),
    })
})

export const {
    useGetAdminStatQuery,
    useGetAdminOverviewQuery,
    useGetAllTeachersByAdminQuery,
    useGetAllStudentsByAdminQuery
} = adminApi;