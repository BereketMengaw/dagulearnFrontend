"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Fetch enrolled courses from the API using user.userId
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/user/${user.userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setCourses(data.courses); // Assuming data.courses contains the course data
        } else {
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="spinner-border animate-spin text-gray-500"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-gray-500 text-lg ml-4">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.length > 0 ? (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li
              key={`${course.id}-${course.title}`} // Ensures a unique key
              className="p-4 bg-gray-50 border rounded-lg hover:shadow-md hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Price: {course.price} ETB
              </div>
              <button
                className="mt-4 text-blue-500 hover:underline"
                onClick={() => router.push(`/${course.title}`)}
              >
                View Course
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          You have not purchased any courses yet. Browse our{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push("/")}
          >
            courses
          </span>{" "}
          to get started!
        </p>
      )}
    </div>
  );
};

export default CourseList;
