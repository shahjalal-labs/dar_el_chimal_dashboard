import { baseApi } from "./baseApi";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation({
      query: (formData) => ({
        url: `/book/create-book`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["books"],
    }),
    uploadResource: builder.mutation({
      query: (formData) => ({
        url: `/book/upload-file`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["books"],
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
      providesTags: ["books", "resource"],
    }),
    updateBook: builder.mutation({
      query: ({ bookId, formData }) => ({
        url: `/book/update-book/${bookId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["books"],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `/book/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["books"],
    }),
  }),
});

export const {
  useCreateBookMutation,
  useUploadResourceMutation,
  useGetAllBooksQuery,
  useGetSingleBookQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;
