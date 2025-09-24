import { baseApi } from "../baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEcommerceBookings: builder.query({
            query: (currentPage) => ({
                url: `/e-commerce/booking?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['booking'],
        }),
    }),
});

export const { useGetAllEcommerceBookingsQuery } = bookingApi;