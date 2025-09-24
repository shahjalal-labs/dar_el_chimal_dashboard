import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => ({
                url: `/auth/profile`,
                method: 'GET',
            }),
            providesTags: ['profile']
        }),
        updateMyProfile: builder.mutation({
            query: (body) => ({
                url: `/auth/update-profile`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: ['profile']
        }),
        updateMyProfileImg: builder.mutation({
            query: (body) => ({
                url: `/auth/update-profile-image`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: ['profile']
        })
    }),
})

export const { useGetMyProfileQuery, useUpdateMyProfileMutation, useUpdateMyProfileImgMutation } = settingsApi;