import { baseApi } from "../baseApi";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getassignmentDetails: builder.query({
      query: (id) => ({
        url: `/assignment/${id}`,
        method: "GET",
      }),
    }),
    submitAssingmentAns: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/assignment/submit/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const { useGetassignmentDetailsQuery, useSubmitAssingmentAnsMutation } =
  assignmentApi;
