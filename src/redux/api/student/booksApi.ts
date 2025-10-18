import { baseApi } from "../baseApi";

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookDetails: builder.query({
      query: (id) => ({
        url: `/book/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBookDetailsQuery } = booksApi;
