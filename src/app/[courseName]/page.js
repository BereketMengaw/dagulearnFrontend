"use client";
import { useState, useEffect } from "react";
import React from "react";
import { fetchCourseByName, fetchChaptersByCourseId } from "@/lib/fetcher";
import CourseDetails from "@/components/coursePage/CourseDetails";
import Navbar from "@/components/Navbar/Navbar";
import AuthPopup from "@/app/auth/AuthPopup";
import Load from "@/components/load/page";
import Link from "next/link";

export const dynamic = "force-dynamic"; // Ensures fresh data on each request

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [error, setError] = useState(null);

  // Use React.use() to unwrap params
  const { courseName } = React.use(params);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseName) {
        setError("Invalid course");
        return;
      }

      try {
        // Normalise whatever encoding the route param arrives in before calling the API.
        const courseData = await fetchCourseByName(
          encodeURIComponent(decodeURIComponent(courseName))
        );
        if (!courseData) {
          setError("Course not found");
          return;
        }

        const chaptersData = await fetchChaptersByCourseId(courseData.id);

        setCourse(courseData);
        setChapters(chaptersData);
      } catch (err) {
        setError("An error occurred while fetching course data.");
      }
    };

    fetchCourseData();
  }, [courseName]); // Fetch the data when the course name changes

  if (error) {
    return (
      <div>
        <Navbar setShowAuthPopup={setShowAuthPopup} />
        {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="text-2xl font-extrabold text-slate-900">{error}</p>
          <p className="mt-2 text-slate-500">It may have been renamed or removed.</p>
          <Link href="/#courses" className="btn-primary mt-6">
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course || !chapters) {
    return (
      <div>
        <Navbar setShowAuthPopup={setShowAuthPopup} />
        <Load />
      </div>
    );
  }

  return (
    <div>
      <Navbar setShowAuthPopup={setShowAuthPopup} />
      {showAuthPopup && (
        <AuthPopup
          setShowAuthPopup={setShowAuthPopup}
          onClose={() => setShowAuthPopup(false)}
        />
      )}
      <CourseDetails
        course={course}
        chapters={chapters}
        setShowAuthPopup={setShowAuthPopup}
      />
      {/* Room for the mobile buy bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
