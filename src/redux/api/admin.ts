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
            query: ({ schoolId }) => ({
                url: `${schoolId !== undefined ? `/users/get-teachers?schoolId=${schoolId}` : '/users/get-teachers'}`,
                method: "GET",
            }),
            providesTags: ["teacher"],
        }),
        getAllStudentsByAdmin: builder.query({
            query: ({ schoolId }) => ({
                url: `${schoolId !== undefined ? `/users/get-students?schoolId=${schoolId}` : '/users/get-students'}`,
                method: "GET",
            }),
            providesTags: ["student"],
        }),
        getAllSchoolsByAdmin: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/school?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["school"],
        }),
    })
})

export const {
    useGetAdminStatQuery,
    useGetAdminOverviewQuery,
    useGetAllTeachersByAdminQuery,
    useGetAllStudentsByAdminQuery,
    useGetAllSchoolsByAdminQuery
} = adminApi;