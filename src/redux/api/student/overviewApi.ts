import { baseApi } from "../baseApi";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentOverview: builder.query({
      query: () => ({
        url: `/student/student-overview`,
        method: "GET",
      }),
    }),

    getStudentDetails: builder.query({
      query: (queryField) => ({
        url: `/student/grade-details?queryField=${queryField}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStudentOverviewQuery, useGetStudentDetailsQuery } = AuthApi;
