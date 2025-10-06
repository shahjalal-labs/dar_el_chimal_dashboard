import { baseApi } from "../baseApi";

export const bookCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBookCategory: builder.mutation({
            query: (body) => ({
                url: `/book/categories`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["books"],
        }),
        getAllBookCategories: builder.query({
            query: (currentPage) => ({
                url: `/book/categories?page=${currentPage}&limit=10`,
                method: "GET",
            }),
            providesTags: ["books"],
        }),
        getSingleBookCategory: builder.query({
            query: (id) => ({
                url: `/book/categories/${id}`,
                method: "GET",
            }),
            providesTags: ["books"],
        }),
        updateBookCategory: builder.mutation({
            query: ({ id, body }) => ({
                url: `/book/categories/${id}`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["books"],
        }),
        deleteBookCategroy: builder.mutation({
            query: (id) => ({
                url: `/book/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['books']
        }),
    }),
});

export const {
    useCreateBookCategoryMutation,
    useGetAllBookCategoriesQuery,
    useGetSingleBookCategoryQuery,
    useUpdateBookCategoryMutation,
    useDeleteBookCategroyMutation
} = bookCategoryApi;
