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
        getSearchedTeachers: builder.query({
            query: (searchTerm) => ({
                url: `/users/get-teachers?searchTerm=${searchTerm}`,
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
        getSearchedStudents: builder.query({
            query: ( searchTerm) => ({
                url: `/users/get-students?searchTerm=${searchTerm}`,
                method: "GET",
            }),
            providesTags: ["student"],
        }),
        getAllSchoolsByAdmin: builder.query({
            query: ({ currentPage, limit, searchTerm }) => ({
                url: `/school?page=${currentPage}&limit=${limit}&searchTerm=${searchTerm}`,
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
    useGetSearchedTeachersQuery,
    useGetAllStudentsByAdminQuery,
    useGetSearchedStudentsQuery,
    useGetAllSchoolsByAdminQuery
} = adminApi;