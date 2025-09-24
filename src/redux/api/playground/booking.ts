import { baseApi } from "../baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPlayGroundBooking: builder.query({
            query: (currentPage) => ({
                url: `/practice-ground/booking?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['booking'],
        }),
        getSinglePlayGroundBooking: builder.query({
            query: (id) => ({
                url: `/practice-ground/booking/${id}`,
                method: 'GET',
            }),
            providesTags: ['booking'],
        }),
    }),
});

export const { useGetAllPlayGroundBookingQuery, useGetSinglePlayGroundBookingQuery } = bookingApi;