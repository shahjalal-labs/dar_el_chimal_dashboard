import { baseApi } from "./baseApi";

export const teacherApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createTeacher: builder.mutation({
            query: (formData) => ({
                url: `/users/create-single-teacher`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["teacher"]
        }),
        createBulkTeacher: builder.mutation({
            query: (formData) => ({
                url: `/users/bulk-upload-teacher`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["teacher"]
        }),
        getTeacherDetails: builder.query({
            query: (id) => ({
                url: `/users/single-user/${id}`,
                method: "GET",
            }),
            providesTags: ["teacher"]
        }),
        updateTeacher: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/users/update-user/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["teacher"]
        }),
        deleteSingleTeacher: builder.mutation({
            query: (id) => ({
                url: `/users/delete-user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["teacher"],
        }),
    }),
});

export const { useCreateTeacherMutation, useCreateBulkTeacherMutation, useGetTeacherDetailsQuery, useUpdateTeacherMutation, useDeleteSingleTeacherMutation } = teacherApi;
