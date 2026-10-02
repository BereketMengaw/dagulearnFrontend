"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StudioShell, { Card, StudioLoading } from "@/components/studio/StudioShell";
import { BookOpen, Pencil, ListPlus, Image as ImageIcon, PlusCircle } from "lucide-react";
import { formatPrice, courseHref } from "@/lib/format";
import {
  fetchCoursesByCreator,
  fetchCreator,
  fetchCourseByChapterId,
} from "@/lib/fetcher";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

  const thumbSrc = (t) =>
    !t ? null : t.startsWith("http") ? t : `${process.env.NEXT_PUBLIC_API_URL}${t}`;

  return (
    <StudioShell
      title="My courses"
      subtitle="Every course you've published, with quick links to edit it."
      actions={
        <Link href="/creator-dashboard/create-course" className="btn-primary">
          <PlusCircle size={16} /> New course
        </Link>
      }
    >
      {loading ? (
        <StudioLoading />
      ) : courses.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const thumbnailUrl = thumbSrc(course.thumbnail);
            return (
              <li
                key={course.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Link href={courseHref(course)} className="group block">
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    {thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        <ImageIcon size={18} className="mr-2" /> No thumbnail yet
                      </div>
                    )}
                  </div>
                  <div className="p-5 pb-3">
                    {course.category?.name && (
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                        {course.category.name}
                      </span>
                    )}
                    <h3 className="mt-2 line-clamp-2 font-bold text-slate-900 group-hover:text-brand-700">
                      {course.title?.trim()}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{course.description}</p>
                    <p className="mt-3 text-lg font-extrabold text-slate-900">
                      {formatPrice(course.price)}
                    </p>
                  </div>
                </Link>
                <div className="mt-auto grid grid-cols-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                  <Link
                    href={`/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-1.5 py-3 hover:bg-slate-50 hover:text-brand-700"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <Link
                    href={`/creator-dashboard/${course.id}/create-chapters`}
                    className="flex items-center justify-center gap-1.5 border-x border-slate-100 py-3 hover:bg-slate-50 hover:text-brand-700"
                  >
                    <ListPlus size={14} /> Chapters
                  </Link>
                  <Link
                    href={`/creator-dashboard/${course.id}/upload-thumbnail`}
                    className="flex items-center justify-center gap-1.5 py-3 hover:bg-slate-50 hover:text-brand-700"
                  >
                    <ImageIcon size={14} /> Thumbnail
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="flex flex-col items-center py-14 text-center">
          <BookOpen size={36} className="text-slate-400" />
          <p className="mt-3 font-semibold text-slate-900">No courses yet</p>
          <p className="mt-1 text-sm text-slate-500">Start by creating your first course.</p>
          <Link href="/creator-dashboard/create-course" className="btn-primary mt-5">
            Create a course
          </Link>
        </Card>
      )}

      {(chapterCourse || noChaptersMessage) && (
        <Card className="mt-8">
          {chapterCourse ? (
            <>
              <h3 className="font-bold text-slate-900">Course details</h3>
              <p className="mt-2 text-slate-600">{chapterCourse.description}</p>
              <p className="mt-2 text-sm text-slate-500">Category: {chapterCourse.category?.name}</p>
              <p className="mt-1 font-bold text-slate-900">{formatPrice(chapterCourse.price)}</p>
            </>
          ) : (
            <p className="text-center font-medium text-red-600">{noChaptersMessage}</p>
          )}
        </Card>
      )}
    </StudioShell>
  );
};

export default MyCourses;
