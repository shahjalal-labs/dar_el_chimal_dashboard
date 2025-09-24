import { baseApi } from "../baseApi";

export const parentCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addParentCategory: builder.mutation({
            query: (categoryData) => ({
                url: `/categories/parent-categories`,
                method: 'POST',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        getAllParentCategories: builder.query({
            query: () => ({
                url: `/categories/parent-categories`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        getSingleParentCategory: builder.query({
            query: (id) => ({
                url: `/categories/parent-categories/${id}`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        updateParentCategroy: builder.mutation({
            query: ({ id, categoryData }) => ({
                url: `/categories/parent-categories/${id}`,
                method: 'PATCH',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        deleteParentCategroy: builder.mutation({
            query: (id) => ({
                url: `/categories/parent-categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['category']
        }),
    }),
});

export const {
    useAddParentCategoryMutation,
    useGetAllParentCategoriesQuery,
    useGetSingleParentCategoryQuery,
    useUpdateParentCategroyMutation,
    useDeleteParentCategroyMutation
} = parentCategoryApi;