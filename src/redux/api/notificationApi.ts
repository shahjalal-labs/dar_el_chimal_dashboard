import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyNotifications: builder.query({
            query: () => ({
                url: `/notifications`,
                method: "GET",
            }),
            providesTags: ["notifications"],
        }),
        getNotificationDetails: builder.query({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "GET",
            }),
            providesTags: ["notifications"],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useGetNotificationDetailsQuery
} = notificationApi;