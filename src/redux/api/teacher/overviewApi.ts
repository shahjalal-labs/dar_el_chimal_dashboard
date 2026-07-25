import { baseApi } from "../baseApi";

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeacherOverview: builder.query({
            query: () => ({
                url: `/teacher/teacher-overview`,
                method: "GET",
            }),
            providesTags: ["teacher"]
        }),
        getTeacherGradeDetails: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}`,
                method: "GET",
            }),
            providesTags: ["teacher"]
        }),
        getAllStudentsByTeacher: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}?queryField=students`,
                method: "GET",
            }),
            providesTags: ["teacher", "student"]
        }),
        getStudentDetailsByTeacher: builder.query({
            query: (id) => ({
                url: `/users/single-user/${id}`,
                method: "GET",
            }),
            providesTags: ["teacher", "student"]
        }),
        getAllAssignmentsByTeacher: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}?queryField=assignments`,
                method: "GET",
            }),
            providesTags: ["teacher", "assignment"]
        }),
        getSingleAssignmentByTeacher: builder.query({
            query: (assignmentId) => ({
                url: `/assignment/${assignmentId}`,
                method: "GET",
            }),
            providesTags: ["teacher", "assignment"]
        }),
        getStudentAssignmentDetailsByTeacher: builder.query({
            query: (assignmentProgressId) => ({
                url: `/assignment/teacher/${assignmentProgressId}`,
                method: "GET",
            }),
            providesTags: ["teacher", "assignment"]
        }),
        gradeAssignment: builder.mutation({
            query: ({ assignmentProgressId, body }) => ({
                url: `/assignment/graded/${assignmentProgressId}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["teacher", "assignment"]
        }),
        createAssignment: builder.mutation({
            query: (payload) => ({
                url: `/assignment`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["teacher", "assignment"]
        }),
        getAllBooksForForm: builder.query({
            query: () => ({
                url: `/book/books-for-forms`,
                method: "GET",
            }),
            providesTags: ["books"]
        }),
        getAllAnnouncementsByTeacher: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}?queryField=announcments`,
                method: "GET",
            }),
            providesTags: ["teacher", "announcements"]
        }),
        createAnnouncement: builder.mutation({
            query: ({ id, body }) => ({
                url: `/announcement/${id}`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["teacher", "announcements"]
        }),
        getSingleAnnouncementByTeacher: builder.query({
            query: (announcmentId) => ({
                url: `/announcement/${announcmentId}`,
                method: "GET",
            }),
            providesTags: ["announcements"],
        }),
        updateAnnouncementByTeacher: builder.mutation({
            query: ({ announcmentId, body }) => ({
                url: `/announcement/${announcmentId}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["announcements"]
        }),
        deleteAnnouncementByTeacher: builder.mutation({
            query: (announcmentId) => ({
                url: `/announcement/${announcmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["announcements"]
        }),
        getAllBooksByTeacher: builder.query({
            query: (id) => ({
                url: `/teacher/grade-details/${id}?queryField=books`,
                method: "GET",
            }),
            providesTags: ["teacher", "books"]
        }),
        getAllBooksForTeacher: builder.query({
            query: ({currentPage, limit}) => ({
                url: `/book/for-teacher?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["teacher", "books"]
        }),
    }),
});

export const {
    useGetTeacherOverviewQuery,
    useGetTeacherGradeDetailsQuery,
    useGetAllStudentsByTeacherQuery,
    useGetStudentDetailsByTeacherQuery,
    useGetAllAssignmentsByTeacherQuery,
    useGetSingleAssignmentByTeacherQuery,
    useGetStudentAssignmentDetailsByTeacherQuery,
    useGradeAssignmentMutation,
    useCreateAssignmentMutation,
    useGetAllBooksForFormQuery,
    useGetAllAnnouncementsByTeacherQuery,
    useCreateAnnouncementMutation,
    useGetSingleAnnouncementByTeacherQuery,
    useUpdateAnnouncementByTeacherMutation,
    useDeleteAnnouncementByTeacherMutation,
    useGetAllBooksByTeacherQuery,
    useGetAllBooksForTeacherQuery
} = overviewApi;
