"use client";
import axios from "axios";
import { uploadToS3 } from "@/lib/firebaseStorage";
import { useMutation } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
const FileUpload = () => {
  const {mutate, isLoading} = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
        }) => {
          const response = await axios.post('api/create-chat', { file_key, file_name });
          return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: async (file) => {
      console.log("file", file);
      // s3 alternative
      if (file[0].size < 10 * 1024 * 1024) {
        try {
            const path = await uploadToS3(file[0]);
            if (!path) {
                // toast lib
            }
            mutate({
                file_name: file[0].name,
                file_key: path || ""
            });
        } catch (error) {
          console.error("error >> FileUpload", error);
        }
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-grey-100 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Drop you Files here!</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
