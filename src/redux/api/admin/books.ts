import { baseApi } from "../baseApi";

export const booksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBookCategories: builder.query({
            query: (currentPage) => ({
                url: `/book/categories?page=${currentPage}&limit=10`,
                method: "GET",
            }),
            providesTags: ["books"],
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

export const { useGetAllBookCategoriesQuery, useGetAllVendorsQuery, useGetSingleVendorQuery, useUpdateVendorMutation } = booksApi;
