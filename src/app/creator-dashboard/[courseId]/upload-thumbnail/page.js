"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, Loader2, ArrowRight } from "lucide-react";
import StudioShell, { Card } from "@/components/studio/StudioShell";
import CourseSteps from "@/components/studio/CourseSteps";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UploadThumbnail() {
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
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

    setUploading(true);
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
      setUploading(false);
    }
  };

  return (
    <StudioShell
      title="Add a thumbnail"
      subtitle="This image sells your course in the catalog. A 16:9 image works best."
    >
      <CourseSteps current={2} />

      <Card className="max-w-3xl">
        {errorMessage && (
          <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <label
            htmlFor="thumbnail"
            className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-brand-400 hover:bg-brand-50/40"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Thumbnail preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                  <ImagePlus size={22} />
                </span>
                <span className="mt-3 text-sm font-semibold text-slate-900">Click to choose an image</span>
                <span className="mt-1 text-xs text-slate-500">PNG or JPG, up to 5 MB</span>
              </>
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="sr-only"
            />
          </label>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <p className="truncate text-sm text-slate-500">
              {thumbnail ? thumbnail.name : "No file chosen"}
            </p>
            <button type="submit" className="btn-primary shrink-0" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  Upload & continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </StudioShell>
  );
}
