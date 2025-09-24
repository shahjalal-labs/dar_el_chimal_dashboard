import { baseApi } from "../baseApi";

export const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addSubCategory: builder.mutation({
            query: (categoryData) => ({
                url: `/categories`,
                method: 'POST',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        getAllSubCategories: builder.query({
            query: () => ({
                url: `/categories`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        getSingleSubCategory: builder.query({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        updateSubCategroy: builder.mutation({
            query: ({ id, categoryData }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        deleteSubCategroy: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['category']
        }),
    }),
});

export const {
    useAddSubCategoryMutation,
    useGetAllSubCategoriesQuery,
    useGetSingleSubCategoryQuery,
    useUpdateSubCategroyMutation,
    useDeleteSubCategroyMutation
} = subCategoryApi;