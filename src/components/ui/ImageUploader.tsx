"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Button } from "./button";
import { toast } from "sonner";
import { useUpdateMyProfileImgMutation } from "@/redux/api/settingsApi";

export function ImageUploader() {
  const [show, setShow] = useState(true)
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadImage, { isLoading }] = useUpdateMyProfileImgMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFiles(acceptedFiles);
      setPreviews(newPreviews);
      setError(null);
      setUploadedUrls([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      const code = rejection.errors[0].code;
      if (code === "file-too-large") {
        setError("File is too large. Maximum size is 5MB.");
      } else if (code === "file-invalid-type") {
        setError("Invalid file type. Please upload an image.");
      } else {
        setError("Error uploading file. Please try again.");
      }
    },
  });

  const handleUpload = async () => {
    if (!files.length) return;

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("profileImage", file);
      });
      const body = formData;
      const res = await uploadImage(body).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        setShow(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleReset = () => {
    setFiles([]);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setUploadedUrls([]);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {
        show &&
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
            (files.length || error) && "border-gray-300"
          )}
        >
          <input {...getInputProps()} />
          {previews.length ? (
            <div className="w-fit mx-auto">
              {previews.map((src, idx) => (
                <div key={idx} className="w-full rounded-md">
                  <Image src={src} alt={`Preview ${idx}`} height={100} width={100} className="" priority />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive ? "Drop the images here" : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF, WEBP (max 5MB each)</p>
            </div>
          )}
        </div>
      }

      {/* {!files.length && (
        <div className="flex justify-center items-center">
          <label className="flex-1 text-black border px-2 py-0.5 flex justify-center items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files);
                  const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
                  setFiles(selectedFiles);
                  setPreviews(previewUrls);
                  setUploadedUrls([]);
                  setError(null);
                }
              }}
              multiple={true}
            />
            <div>
              <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Take or upload photo</p>
            </div>
          </label>
        </div>
      )} */}

      {
        show && (
          <>
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm flex items-center">
                <X className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {!!files.length && (
              <div className="flex flex-col gap-1 text-sm">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {!!files.length && !uploadedUrls.length && (
                <Button onClick={handleUpload} disabled={isLoading} className="flex-1 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Upload</>
                  )}
                </Button>
              )}

              {/* {uploadedUrls.length > 0 && (
                <div className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm flex items-center">
                  <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                  {uploadedUrls.length} image(s) uploaded successfully!
                </div>
              )} */}

              {(files.length > 0 || error) && (
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  Reset
                </Button>
              )}
            </div>
          </>
        )
      }

      {/* {uploadedUrls.length > 0 && (
        <div className="pt-2 space-y-2">
          <p className="text-xs text-gray-500 mb-1">Uploaded Image URLs:</p>
          {uploadedUrls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="text" value={url} readOnly className="flex-1 text-xs p-2 border rounded bg-gray-50" />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success("Copied");
                }}
              >
                Copy
              </Button>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
