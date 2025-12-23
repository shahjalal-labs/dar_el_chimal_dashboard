import { baseApi } from "../baseApi";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentOverview: builder.query({
      query: () => ({
        url: `/student/student-overview`,
        method: "GET",
      }),
    }),

    getStudentBooks: builder.query({
      query: (queryField) => ({
        url: `/student/grade-details?queryField=${queryField}`,
        method: "GET",
      }),
    }),
    getAnnouncementDetails: builder.query({
      query: (id) => ({
        url: `announcement/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetStudentOverviewQuery,
  useGetStudentBooksQuery,
  useGetAnnouncementDetailsQuery,
} = AuthApi;
