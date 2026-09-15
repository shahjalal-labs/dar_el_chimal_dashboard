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
            query: (params: { schoolId?: string; searchTerm?: string } = {}) => {
                const query = new URLSearchParams();
                if (params?.schoolId && params.schoolId !== "all") {
                    query.append("schoolId", params.schoolId);
                }
                if (params?.searchTerm && params.searchTerm.trim()) {
                    query.append("searchTerm", params.searchTerm.trim());
                }
                const queryString = query.toString();
                return {
                    url: `/users/get-teachers${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
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
            query: (params: { schoolId?: string; searchTerm?: string } = {}) => {
                const query = new URLSearchParams();
                if (params?.schoolId && params.schoolId !== "all") {
                    query.append("schoolId", params.schoolId);
                }
                if (params?.searchTerm && params.searchTerm.trim()) {
                    query.append("searchTerm", params.searchTerm.trim());
                }
                const queryString = query.toString();
                return {
                    url: `/users/get-students${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
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