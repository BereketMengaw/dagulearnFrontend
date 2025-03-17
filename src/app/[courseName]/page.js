"use client";
import { useState, useEffect } from "react";
import React from "react";
import { fetchCourseByName, fetchChaptersByCourseId } from "@/lib/fetcher";
import CourseDetails from "@/components/coursePage/CourseDetails";
import Navbar from "@/components/Navbar/Navbar";
import AuthPopup from "@/app/auth/AuthPopup";
import Load from "@/components/load/page";

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
        const courseData = await fetchCourseByName(courseName);
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
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!course || !chapters) {
    return (
      <div>
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
      <CourseDetails course={course} chapters={chapters} />
    </div>
  );
}
