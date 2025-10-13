import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

const baseUrl = "http://10.0.20.222:5555/api/v1";
// const baseUrl = "https://api.darelchimalapp.com/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;

      // headers.set("x-api-key", 'AABBCCCDDDJJKKIIUU1234');

      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "books",
    "school",
    "teacher",
    "student",
    "grade",
    "resource",
    "admin",
    "notifications",
    "profile"
  ],
});
