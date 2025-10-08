import { baseApi } from "../baseApi";

export const schoolApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTeachers: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/users/get-teachers?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["teacher"],
        }),
    }),
});

export const { useGetAllTeachersQuery } = schoolApi;
