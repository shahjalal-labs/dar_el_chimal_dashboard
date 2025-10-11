import { baseApi } from "./baseApi";

export const schoolApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSchools: builder.query({
            query: ({ currentPage, limit }) => ({
                url: `/school?page=${currentPage}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["school"],
        }),
    }),
});

export const { useGetAllSchoolsQuery } = schoolApi;
