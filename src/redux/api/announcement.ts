import { baseApi } from "./baseApi";

export const announcementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAnnouncement: builder.mutation({
            query: (body) => ({
                url: `/announcement`,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["announcement"]
        }),
        getAllAnnouncements: builder.query({
            query: () => ({
                url: `/announcement`,
                method: "GET",
            }),
            providesTags: ["announcement"],
        }),
        getSingleAnnouncement: builder.query({
            query: (id) => ({
                url: `/announcement/${id}`,
                method: "GET",
            }),
            providesTags: ["announcement"],
        }),
        updateAnnouncement: builder.mutation({
            query: ({ id, body }) => ({
                url: `/announcement/${id}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["announcement"]
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `/announcement/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["announcement"]
        }),
    }),
});

export const { useCreateAnnouncementMutation, useGetAllAnnouncementsQuery, useGetSingleAnnouncementQuery, useUpdateAnnouncementMutation, useDeleteAnnouncementMutation } = announcementApi;
