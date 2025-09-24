import { baseApi } from "../baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEventBookings: builder.query({
            query: (currentPage) => ({
                url: `/event/booking?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['booking'],
        }),
    }),
});

export const { useGetAllEventBookingsQuery } = bookingApi;