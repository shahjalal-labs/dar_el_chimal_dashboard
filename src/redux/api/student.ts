import { baseApi } from "./baseApi";

export const studentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createStudent: builder.mutation({
            query: (formData) => ({
                url: `/users/create-single-student`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["student"]
        }),
        createBulkStudent: builder.mutation({
            query: (formData) => ({
                url: `/users/bulk-upload-student`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["student"]
        }),
        getStudentDetails: builder.query({
            query: (id) => ({
                url: `/users/single-user/${id}`,
                method: "GET",
            }),
            providesTags: ["student"]
        }),
        updateStudent: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/users/update-user/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["student"]
        }),
        deleteAllStudents: builder.mutation({
            query: () => ({
                url: `/user/delete-students`,
                method: "DELETE",
            }),
            invalidatesTags: ["student"],
        }),
    }),
});

export const { useCreateStudentMutation, useCreateBulkStudentMutation, useGetStudentDetailsQuery, useUpdateStudentMutation, useDeleteAllStudentsMutation } = studentApi;
