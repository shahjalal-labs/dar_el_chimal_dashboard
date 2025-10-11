import { baseApi } from "./baseApi";

export const resourceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createResource: builder.mutation({
            query: ({ bookId, formData }) => ({
                url: `/resource/create/${bookId}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["resource"]
        }),
        getSingleResource: builder.query({
            query: (resourceId) => ({
                url: `/resource/${resourceId}`,
                method: "GET",
            }),
            providesTags: ["resource"],
        }),
        updateResource: builder.mutation({
            query: ({ resourceId, formData }) => ({
                url: `/resource/update/${resourceId}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["resource"]
        }),
        deleteResource: builder.mutation({
            query: (resourceId) => ({
                url: `/resource/${resourceId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["resource"]
        }),
    }),
});

export const { useCreateResourceMutation, useGetSingleResourceQuery, useUpdateResourceMutation, useDeleteResourceMutation } = resourceApi;
