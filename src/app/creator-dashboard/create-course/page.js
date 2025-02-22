"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import { fetchCategories } from "@/lib/fetcher";
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CourseCreate() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [creatorId, setCreatorId] = useState();

  // Retrieve user data from localStorage

  useEffect(() => {
    // This will run only on the client-side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setCreatorId(parsedUser.userId);
      } else {
      }
    }
  }, [router]);

  // ✅ Check if user is a creator
  const { creator, loading: checkingCreator } = useCheckCreator(
    userData?.userId
  );

  useEffect(() => {
    // If creator check is done and user is not a creator or no creator data, redirect
    if (!checkingCreator && (creator === false || creator === null)) {
      alert("First fill creator information.");
      router.push(
        "${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register"
      );
    }
  }, [checkingCreator, creator, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setErrorMessage("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData || !userData.userId) {
        throw new Error("User not found.");
      }

      const coursePayload = {
        ...courseData,
        creatorId: userData.userId,
      };

      // Step 1: Create Course
      const response = await fetch(`${apiUrl}/api/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coursePayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create course.");
      }

      // Redirect to the thumbnail upload page
      router.push(`/creator-dashboard/${data.course.id}/upload-thumbnail`);
      console.log("The course ID is", data.course.id);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingCreator) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Checking permissions...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-2xl rounded-xl space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
          Create a New Course
        </h1>

        {errorMessage && (
          <p className="text-center text-red-600 font-semibold">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              placeholder="Enter course title"
            />
          </div>

          {/* Course Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              placeholder="Enter course description"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Course Price (ETB)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              placeholder="Enter course price"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={courseData.categoryId}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading categories...</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`px-8 py-3 rounded-lg text-lg font-semibold transition duration-200 ${
                loading
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
