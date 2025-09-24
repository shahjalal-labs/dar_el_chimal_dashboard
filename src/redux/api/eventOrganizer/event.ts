import { baseApi } from "../baseApi";

export const eventApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addEvent: builder.mutation({
            query: (eventData) => ({
                url: `/event/create-event`,
                method: 'POST',
                body: eventData
            }),
            invalidatesTags: ['event']
        }),
        getAllEvents: builder.query({
            query: (currentPage) => ({
                url: `/event?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['event'],
        }),
        getSingleEvent: builder.query({
            query: (id) => ({
                url: `/event/${id}`,
                method: 'GET'
            }),
            providesTags: ['event']
        }),
        updateEvent: builder.mutation({
            query: ({ id, eventData }) => ({
                url: `/event/update-event/${id}`,
                method: 'PATCH',
                body: eventData
            }),
            invalidatesTags: ['event']
        }),
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/event/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['event']
        }),
    }),
});

export const { useGetAllEventsQuery, useAddEventMutation, useGetSingleEventQuery, useUpdateEventMutation, useDeleteEventMutation } = eventApi;