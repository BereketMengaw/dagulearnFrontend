"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UploadThumbnail() {
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { courseId } = useParams(); // Get courseId from the URL

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate image size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("Image size must be less than 5MB.");
        setThumbnail(null);
        setImagePreview("");
        return;
      }

      setErrorMessage(""); // Clear any previous error messages
      setThumbnail(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the image
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
      const response = await fetch(
        `${apiUrl}/api/courses/${courseId}/thumbnail`,
        {
          method: "POST",
          body: formData,
        }
      );

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
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Upload Course Thumbnail
      </h1>

      {errorMessage && (
        <p className="text-center text-red-600 font-semibold mb-4">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Select Thumbnail image upto 1mb(max)
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <div className="w-64 h-64 overflow-hidden rounded-lg shadow-md">
              <img
                src={imagePreview}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Upload Thumbnail
          </button>
        </div>
      </form>
    </div>
  );
}
