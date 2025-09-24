import { baseApi } from "../baseApi";

export const productCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProductCategory: builder.mutation({
            query: (categoryData) => ({
                url: `/e-commerce/categories`,
                method: 'POST',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        getAllProductCategories: builder.query({
            query: () => ({
                url: `/e-commerce/categories`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        getSingleProductCategory: builder.query({
            query: (id) => ({
                url: `/e-commerce/categories/${id}`,
                method: 'GET'
            }),
            providesTags: ['category']
        }),
        updateProductCategroy: builder.mutation({
            query: ({ id, categoryData }) => ({
                url: `/e-commerce/categories/${id}`,
                method: 'PATCH',
                body: categoryData
            }),
            invalidatesTags: ['category']
        }),
        deleteProductCategroy: builder.mutation({
            query: (id) => ({
                url: `/e-commerce/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['category']
        }),
    }),
});

export const {
    useAddProductCategoryMutation,
    useGetAllProductCategoriesQuery,
    useGetSingleProductCategoryQuery,
    useUpdateProductCategroyMutation,
    useDeleteProductCategroyMutation
} = productCategoryApi;