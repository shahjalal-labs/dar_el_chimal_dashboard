"use client";

import React, { useRef, useState } from "react";
// import { Button } from "../ui/Button";
// import { useUplaodVideoMutation } from "@/redux/api/Courses";
// import { toast, ToastContainer } from "react-toastify";
import { Plus } from "lucide-react";
// import { useUploadFileMutation } from "@/redux/api/uploadFile";
import { toast } from "sonner";
import { Button } from "./button";

interface CreateSubGroupProps {
  setIsUpload: (value: boolean) => void;
  id: string;
}

export default function UploadVideo({ setIsUpload, /* id */ }: CreateSubGroupProps) {
  // State for file uploads
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Refs for hidden file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);

      // Create preview URL for video
      const fileUrl = URL.createObjectURL(file);
      setVideoPreview(fileUrl);
    }
  };

  // Trigger file input click
  const triggerVideoUpload = () => {
    videoInputRef.current?.click();
  };

//   const [/* uploadImageFN */, { isLoading: loading }] = useUploadFileMutation();

//   const [uploadVideoFN, { isLoading }] = useUplaodVideoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append video file to form data
    if (!videoFile) {
      toast.error("Please select a video file before uploading.");
      return;
    }
    formData.append("file", videoFile);

    try {
    //   const res = await uploadImageFN(formData);

    //   const fileUrl = res?.data?.data?.fileUrl;

      try {
        /* if (fileUrl) {
          const response = await uploadVideoFN({ videoUrl: fileUrl, id });

          if (response?.data?.success) {
            toast.success(
              response?.data?.message || "Video uploaded successfully!"
            );
            setIsUpload(false);
          } else {
            toast.error(
              response?.data?.error?.message || "Video upload failed........"
            );
          }
        } */
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("An error occurred during upload.");
    }
  };

  return (
    <div>
      {/* <ToastContainer /> */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-lg font-semibold mb-4 ">Create Sub Group</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block font-bold text-[#374151] mb-2">
                Upload Video
              </label>
              <div
                onClick={triggerVideoUpload}
                className={`
                 h-40 flex items-center justify-center cursor-pointer
                  hover:bg-gray-50 transition-colors
                  ${videoPreview ? "bg-gray-50" : "bg-white"}
                `}
              >
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    className="h-full w-full object-contain"
                    controls
                  />
                ) : (
                  <Plus className="text-gray-400" size={24} />
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="px-6 py-2 bg-primary text-white hover:bg-primary/80"
              >
                {/* {isLoading || loading ? "Uploading..." : "Upload"} */}
              </Button>
              <button
                onClick={() => setIsUpload(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
