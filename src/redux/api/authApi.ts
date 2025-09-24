/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({
        url: `/users/vendor`,
        method: "POST",
        body: body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: `/auth/login-admin-or-vendor`,
        method: "POST",
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/send-otp",
          method: "POST",
          body: body,
        };
      },
    }),
    otpUser: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data: any) => {
        return {
          url: "/auth/reset-password",
          method: "PATCH",
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: body,
      }),
    }),
    addVendorsDoc: builder.mutation({
      query: (body) => ({
        url: `/users/vendor-docs`,
        method: "PATCH",
        body: body,
      }),
    }),
    addBankInfo: builder.mutation({
      query: ({ body }) => ({
        url: `/payment/vendor-bankInfo`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ['bank']
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useOtpUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useAddVendorsDocMutation,
  useAddBankInfoMutation
} = AuthApi;
