import { baseApi } from "./baseApi";

export const eventApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEvents: builder.query({
            query: (currentPage) => ({
                url: `/event?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['event'],
        }),
    }),
});

export const { useGetAllEventsQuery } = eventApi;