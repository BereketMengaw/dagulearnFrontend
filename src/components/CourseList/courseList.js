"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";
import { CourseCardSkeleton } from "@/components/HomePage/CourseCard";
import { formatPrice, courseHref } from "@/lib/format";

const CourseList = ({ onLogin }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setLoggedOut(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/user/${user.userId}`
        );
        const data = await response.json();
        if (response.ok) setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (loggedOut) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <BookOpen size={36} className="text-slate-400" />
        <p className="mt-3 font-semibold text-slate-900">Log in to see your courses</p>
        <button onClick={onLogin} className="btn-primary mt-5">
          Log in
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-700">{error}</p>
        <button className="btn-secondary mt-4" onClick={() => location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <BookOpen size={36} className="text-slate-400" />
        <p className="mt-3 font-semibold text-slate-900">You haven&apos;t bought a course yet</p>
        <p className="mt-1 text-sm text-slate-500">Every course has a free first chapter to try.</p>
        <Link href="/#courses" className="btn-primary mt-5">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <li key={`${course.id}-${course.title}`}>
          <Link
            href={courseHref(course)}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
          >
            <div className="relative aspect-video bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.thumbnail || "/images/Thumbnail.jpg"}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/30 group-hover:opacity-100">
                <PlayCircle size={44} className="text-white" />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-bold text-slate-900 group-hover:text-brand-700">{course.title?.trim()}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4 text-sm">
                <span className="text-slate-500">Paid {formatPrice(course.price)}</span>
                <span className="font-semibold text-brand-700">Continue →</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CourseList;
