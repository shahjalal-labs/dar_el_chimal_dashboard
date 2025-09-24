import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

const baseUrl = "https://api.riyaada.com/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;
      
      headers.set("x-api-key", 'AABBCCCDDDJJKKIIUU1234');

      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "users",
    "profile",
    "admin",
    "uploadFile",
    "notifications",
    'booking',
    'event',
    'ground',
    'team',
    'ecommerce',
    'store',
    'product',
    'category',
    'bank'
  ],
});
