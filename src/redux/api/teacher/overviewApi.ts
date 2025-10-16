import { baseApi } from "../baseApi";

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeacherOverview: builder.query({
            query: () => ({
                url: `/teacher/teacher-overview`,
                method: "GET",
            }),
            providesTags: ["teacher"]
        }),
        getTeacherGradeDetails: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}`,
                method: "GET",
            }),
            providesTags: ["teacher"]
        }),
    }),
});

export const { useGetTeacherOverviewQuery, useGetTeacherGradeDetailsQuery } = overviewApi;
