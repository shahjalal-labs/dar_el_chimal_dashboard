/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentOverview: builder.query({
      query: () => ({
        url: `/student/student-overview`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStudentOverviewQuery } = AuthApi;
