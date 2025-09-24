import { baseApi } from "./baseApi";

const UploadFile = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation({
      query: (formData) => ({
        url: `/messages/generate-url`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["uploadFile"],
    }),
  }),
});

export const { useUploadFileMutation } = UploadFile;
export default UploadFile;
