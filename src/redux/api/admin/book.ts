import { baseApi } from "../baseApi";

export const bookApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBook: builder.mutation({
            query: (formData) => ({
                url: `/book/create-book`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["books"]
        }),
        uploadResource: builder.mutation({
            query: (formData) => ({
                url: `/book/upload-file`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["books"]
        }),
        getAllBooks: builder.query({
            query: (currentPage) => ({
                url: `/book?page=${currentPage}&limit=10`,
                method: "GET",
            }),
            providesTags: ["books"],
        }),
        getSingleBook: builder.query({
            query: (id) => ({
                url: `/book/${id}`,
                method: "GET",
            }),
            providesTags: ["books"],
        }),
    }),
});

export const { useCreateBookMutation, useUploadResourceMutation, useGetAllBooksQuery, useGetSingleBookQuery } = bookApi;
