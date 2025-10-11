import { baseApi } from "./baseApi";

export const gradeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGrades: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/grade?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["grade"],
        }),
    }),
});

export const { useGetAllGradesQuery } = gradeApi;
