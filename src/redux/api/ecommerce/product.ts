import { baseApi } from "../baseApi";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (productData) => ({
                url: `/e-commerce/products`,
                method: 'POST',
                body: productData
            }),
            invalidatesTags: ['product']
        }),
        getAllProducts: builder.query({
            query: (currentPage) => ({
                url: `/e-commerce/products?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['product'],
        }),
        getSingleProduct: builder.query({
            query: (id) => ({
                url: `/e-commerce/products/${id}`,
                method: 'GET'
            }),
            providesTags: ['product']
        }),
        updateProduct: builder.mutation({
            query: ({ id, productData }) => ({
                url: `/e-commerce/products/${id}`,
                method: 'PATCH',
                body: productData
            }),
            invalidatesTags: ['product']
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/e-commerce/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['product']
        }),
    }),
});

export const {
    useAddProductMutation,
    useGetAllProductsQuery,
    useGetSingleProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;