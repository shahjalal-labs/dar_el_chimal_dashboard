import { baseApi } from "../baseApi";

export const storeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addStore: builder.mutation({
            query: (storeData) => ({
                url: `/e-commerce/stores`,
                method: 'POST',
                body: storeData
            }),
            invalidatesTags: ['store']
        }),
        getAllStores: builder.query({
            query: (currentPage) => ({
                url: `/e-commerce/stores?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['store'],
        }),
        getSingleStore: builder.query({
            query: (id) => ({
                url: `/e-commerce/stores/${id}`,
                method: 'GET'
            }),
            providesTags: ['store']
        }),
        updateStore: builder.mutation({
            query: ({ id, storeData }) => ({
                url: `/e-commerce/stores/${id}`,
                method: 'PATCH',
                body: storeData
            }),
            invalidatesTags: ['store']
        }),
        deleteStore: builder.mutation({
            query: (id) => ({
                url: `/e-commerce/stores/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['store']
        }),
    }),
});

export const { useGetAllStoresQuery, useAddStoreMutation, useGetSingleStoreQuery, useUpdateStoreMutation, useDeleteStoreMutation } = storeApi;