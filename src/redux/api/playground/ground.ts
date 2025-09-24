import { baseApi } from "../baseApi";

export const groundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addGround: builder.mutation({
            query: (groundData) => ({
                url: `/practice-ground`,
                method: 'POST',
                body: groundData
            }),
            invalidatesTags: ['ground']
        }),
        getAllAvailableGrounds: builder.query({
            query: (currentPage) => ({
                url: `/practice-ground?page=${currentPage}`,
                method: 'GET'
            }),
            providesTags: ['ground']
        }),
        getSingleGround: builder.query({
            query: (id) => ({
                url: `/practice-ground/${id}`,
                method: 'GET'
            }),
            providesTags: ['ground']
        }),
        updateGround: builder.mutation({
            query: ({ id, groundData }) => ({
                url: `/practice-ground/${id}`,
                method: 'PATCH',
                body: groundData
            }),
            invalidatesTags: ['ground']
        }),
        deleteGround: builder.mutation({
            query: (id) => ({
                url: `/practice-ground/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ground']
        }),
    }),
});

export const {
    useAddGroundMutation,
    useGetAllAvailableGroundsQuery,
    useGetSingleGroundQuery,
    useUpdateGroundMutation,
    useDeleteGroundMutation
} = groundApi;