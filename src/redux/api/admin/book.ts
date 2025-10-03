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
    }),
});

export const { useGetAllBooksQuery } = bookApi;
