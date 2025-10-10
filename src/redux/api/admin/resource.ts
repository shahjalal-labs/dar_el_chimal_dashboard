import { baseApi } from "../baseApi";

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
    }),
});

export const {useCreateResourceMutation, useGetSingleResourceQuery } = resourceApi;
