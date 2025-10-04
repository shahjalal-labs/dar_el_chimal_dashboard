import { baseApi } from "../baseApi";

export const bookApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

export const { useGetAllBooksQuery, useGetSingleBookQuery } = bookApi;
