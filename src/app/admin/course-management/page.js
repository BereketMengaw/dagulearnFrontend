"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CourseManagement() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null); // State to manage the course being edited
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to manage update success message

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect to login if not admin or not logged in
    }
  }, [router]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/courses `);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again later.");
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    // Confirm before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!isConfirmed) return; // Exit if the user cancels

    try {
      const response = await fetch(`${apiUrl}/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course. Please try again.");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course); // Set the course to be edited
    setUpdateSuccess(false); // Reset the update success message
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${apiUrl}/api/courses/${editingCourse.id}`,
        {
          method: "PUT", // or "PATCH" depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingCourse),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      const updatedCourse = await response.json();
      setCourses(
        courses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      setEditingCourse(null); // Clear the editing state
      setUpdateSuccess(true); // Show success message
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Failed to update course. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Course updated successfully!
        </div>
      )}
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.description}</p>
                {/* Display the creator's name */}
                <p className="text-sm text-gray-500">
                  Created by: {course.creator?.name || "Unknown"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <a
                  href={`/${course.title}`}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingCourse.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingCourse.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
