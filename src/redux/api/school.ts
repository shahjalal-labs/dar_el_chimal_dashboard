import { baseApi } from "./baseApi";

export const schoolApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSchool: builder.mutation({
            query: (formData) => ({
                url: `/school`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["school"]
        }),
        getSingleSchool: builder.query({
            query: (id) => ({
                url: `/school/${id}`,
                method: "GET",
            }),
            providesTags: ["school"],
        }),
        updateSchool: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/school/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["school"]
        }),
    }),
});

export const { useCreateSchoolMutation, useGetSingleSchoolQuery, useUpdateSchoolMutation } = schoolApi;
