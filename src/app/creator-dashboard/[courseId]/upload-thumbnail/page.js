"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UploadThumbnail() {
  const [thumbnail, setThumbnail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { courseId } = useParams(); // Get courseId from the URL

  const handleThumbnailChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    try {
      const response = await fetch(`${apiUrl}/courses/${courseId}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload thumbnail.");
      }

      // Redirect to the chapter creation page after successful upload
      router.push(`/creator-dashboard/${courseId}/create-chapters`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Upload Course Thumbnail
      </h1>

      {errorMessage && (
        <p className="text-center text-red-600 font-semibold">{errorMessage}</p>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-lg font-semibold text-gray-700"
          >
            Select Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Upload Thumbnail
          </button>
        </div>
      </form>
    </div>
  );
}
