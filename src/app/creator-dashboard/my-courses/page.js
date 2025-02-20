"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import {
  fetchCoursesByCreator,
  fetchCreator,
  fetchCourseByChapterId,
} from "@/lib/fetcher";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

const MyCourses = () => {
  const router = useRouter(); // ✅ Initialize router
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatorId, setCreatorId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [chapterCourse, setChapterCourse] = useState(null);
  const [noChaptersMessage, setNoChaptersMessage] = useState(""); // State for backup message
  const [userData, setUserData] = useState(null);

  // Fetch user data from localStorage (client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.userId);
        setUserData(parsedUser);
      }
    }
  }, []);

  // Fetch creator ID using userId
  useEffect(() => {
    const fetchAndSetCreatorId = async () => {
      if (!userId) return;
      try {
        const creator = await fetchCreator(userId);

        setCreatorId(creator.id);
      } catch (error) {
        throw error("Failed to fetch creator:", error);
      }
    };

    fetchAndSetCreatorId();
  }, [userId]);

  // ✅ Check if user is a creator
  const { creator, loading: checkingCreator } = useCheckCreator(
    userData?.userId
  );

  useEffect(() => {
    // If creator check is done and user is not a creator or no creator data, redirect
    if (!checkingCreator && (creator === false || creator === null)) {
      alert("First fill creator information.");
      router.push(
        `${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register`
      );
    }
  }, [checkingCreator, creator, router]);

  // Fetch courses using creatorId
  useEffect(() => {
    const loadCourses = async () => {
      if (!creatorId) return;
      setLoading(true);
      try {
        const data = await fetchCoursesByCreator(userId);
        console.log(creatorId);
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
      setLoading(false);
    };

    loadCourses();
  }, [creatorId, userId]); // Add 'userId' as a dependency

  // Fetch course details by chapter ID
  const handleFetchCourseByChapter = async (chapterId) => {
    try {
      const course = await fetchCourseByChapterId(chapterId);
      if (course && course.id) {
        setChapterCourse(course);
        setNoChaptersMessage(""); // Reset the backup message
      } else {
        setNoChaptersMessage("🚨 No chapters available for this course.");
        setChapterCourse(null);
      }
    } catch (error) {
      console.error("Failed to fetch course by chapter ID:", error);
      setNoChaptersMessage("⚠️ Could not fetch chapters. Try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            📚 My Courses
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading courses...</p>
          ) : courses.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const thumbnailUrl = course.thumbnail
                  ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
                  : null;

                return (
                  <li
                    key={course.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border transition-transform transform hover:scale-105"
                  >
                    {/* Course Link */}
                    <Link href={`/${course.title}`}>
                      <div className="cursor-pointer">
                        {/* Thumbnail */}
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-md mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                            No Image Available
                          </div>
                        )}

                        {/* Course Details */}
                        <h3 className="text-xl font-semibold text-gray-800">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {course.description}
                        </p>
                        <span className="block text-gray-700 font-medium mt-2">
                          Category: {course.category?.name}
                        </span>
                        <span className="block text-green-600 font-bold mt-2">
                          Price: {course.price} ETB
                        </span>
                      </div>
                    </Link>

                    {/* Fetch Course by Chapter Button */}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">
              No courses available. Start by creating one!
            </p>
          )}

          {/* Display Fetched Course by Chapter or Backup Message */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
            {chapterCourse ? (
              <>
                <h3 className="text-2xl font-semibold text-gray-800">
                  📖 Course Details (Fetched by Chapter)
                </h3>
                <p className="text-gray-600 mt-2">
                  {chapterCourse.description}
                </p>
                <span className="block text-gray-700 font-medium mt-2">
                  Category: {chapterCourse.category?.name}
                </span>
                <span className="block text-green-600 font-bold mt-2">
                  Price: {chapterCourse.price} ETB
                </span>
              </>
            ) : (
              noChaptersMessage && (
                <p className="text-red-600 font-medium text-center">
                  {noChaptersMessage}
                </p>
              )
            )}
          </div>

          <button
            onClick={() => router.push("/creator-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default MyCourses;
