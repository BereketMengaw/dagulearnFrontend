"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseCreationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [creatorId, setCreatorId] = useState(""); // Assuming the creatorId is passed or available in localStorage
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!title || !description || !price || !creatorId || !categoryId) {
      setErrorMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous error message

    const courseData = {
      title,
      description,
      price,
      creatorId,
      categoryId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Course created successfully!");
        // Optionally, redirect the creator to the course details page
        router.push(`/courses/${data.id}`);
      } else {
        setErrorMessage(
          data.message || "An error occurred while creating the course."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while creating the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-xl rounded-xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Create a New Course
      </h1>

      {/* Success Message */}
      {successMessage && (
        <div className="text-center text-green-600 font-semibold">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-center text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Course Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-4 rounded-lg border border-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700"
          >
            Course Description
          </label>
          <textarea
            id="description"
            className="w-full p-4 rounded-lg border border-gray-300"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-lg font-medium text-gray-700"
          >
            Course Price (ETB)
          </label>
          <input
            type="number"
            id="price"
            className="w-full p-4 rounded-lg border border-gray-300"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="creatorId"
            className="block text-lg font-medium text-gray-700"
          >
            Creator ID
          </label>
          <input
            type="number"
            id="creatorId"
            className="w-full p-4 rounded-lg border border-gray-300"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-lg font-medium text-gray-700"
          >
            Category ID
          </label>
          <input
            type="number"
            id="categoryId"
            className="w-full p-4 rounded-lg border border-gray-300"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
