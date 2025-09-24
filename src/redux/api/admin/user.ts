import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (currentPage) => ({
        url: `/users?page=${currentPage}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getAllVendors: builder.query({
      query: (currentPage) => ({
        url: `/users/vendor?page=${currentPage}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getSingleVendor: builder.query({
      query: (id) => ({
        url: `/users/vendor/${id}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    updateVendor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}/approval`,
        method: "PATCH",
        body: body
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetAllCustomersQuery, useGetAllVendorsQuery, useGetSingleVendorQuery, useUpdateVendorMutation } = userApi;
