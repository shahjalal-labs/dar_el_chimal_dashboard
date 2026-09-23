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
            query: ({ id }) => ({
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
        deleteSchool: builder.mutation({
            query: (id) => ({
                url: `/school/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["school"]
        }),
        uploadSchoolResource: builder.mutation({
            query: (formData) => ({
                url: `/school/upload-file`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["school"],
        }),
        notAssignedBooks: builder.query({
            query: (id) => ({
                url: `/school/not-assigned-books/${id}`,
                method: "GET",
            }),
            providesTags: ["school"],
        }),
        assignBooks: builder.mutation({
            query: (payload) => ({
                url: `/school/assign-books`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["school"],
        }),
        assignedBooks: builder.query({
            query: (id) => ({
                url: `/school/assigned-books/${id}`,
                method: "GET",
            }),
            providesTags: ["school"],
        }),
        unassignBooks: builder.mutation({
            query: (payload) => ({
                url: `/school/unassign-books`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["school"],
        }),
    }),
});

export const {
    useAssignBooksMutation,
    useNotAssignedBooksQuery,
    useAssignedBooksQuery,
    useUnassignBooksMutation,
    useCreateSchoolMutation,
    useGetSingleSchoolQuery,
    useUpdateSchoolMutation,
    useDeleteSchoolMutation,
    useUploadSchoolResourceMutation,
} = schoolApi;
