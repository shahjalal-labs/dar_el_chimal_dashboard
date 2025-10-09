import { baseApi } from "../baseApi";

export const studentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllStudents: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/users/get-students?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["student"],
        }),
    }),
});

export const { useGetAllStudentsQuery } = studentApi;
