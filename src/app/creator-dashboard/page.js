"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, BookOpen, Users, Wallet, ArrowRight, Layers } from "lucide-react";
import StudioShell, { Card, StudioLoading } from "@/components/studio/StudioShell";
import {
  fetchCreator,
  fetchCoursesByCreator,
  fetchEnrollmentsCount,
  fetchEarningsByCreatorId,
} from "@/lib/fetcher";
import { formatPrice, courseHref } from "@/lib/format";
import useCheckCreator from "@/hooks/userCheckMiddleware";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Creators keep 80% of each sale (see the creator agreement).
const CREATOR_SHARE = 0.8;

const CreatorDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState(null);
  const [userId, setuserId] = useState(null);
  const [courses, setCourses] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);
    setUserName(parsedUser.name || "Guest");
    setuserId(parsedUser.userId);
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetchCreator(userId)
      .then(setUser)
      .catch(() => router.push("/noAcess"));

    fetchCoursesByCreator(userId).then(async (list) => {
      setCourses(list);
      const counts = await Promise.all(
        list.map((c) => fetchEnrollmentsCount(c.id).then((r) => [c.id, r?.enrollmentCount || 0]))
      );
      setEnrollments(Object.fromEntries(counts));
    });

    fetchEarningsByCreatorId(userId)
      .then((rows) => setEarnings(Array.isArray(rows) ? rows : []))
      .catch(() => setEarnings([]));
  }, [userId, router]);

  // Send creators without a profile to fill it in first.
  const { creator, loading: checkingCreator } = useCheckCreator(userData?.userId);

  useEffect(() => {
    if (!checkingCreator && (creator === false || creator === null)) {
      router.push("/creator-dashboard/register");
    }
  }, [checkingCreator, creator, router]);

  const totalStudents = Object.values(enrollments).reduce((a, b) => a + b, 0);
  const grossEarnings = (earnings || []).reduce((a, r) => a + Number(r.totalEarnings || 0), 0);
  const firstName = userName.split(" ")[0];

  const stats = [
    { label: "Published courses", value: courses?.length, icon: BookOpen },
    { label: "Students enrolled", value: courses ? totalStudents : undefined, icon: Users },
    {
      label: "Your earnings",
      value: earnings ? formatPrice(grossEarnings * CREATOR_SHARE).replace("Free", "0 ETB") : undefined,
      icon: Wallet,
    },
  ];

  return (
    <StudioShell
      title={`Welcome back, ${firstName}`}
      subtitle="Manage your courses, follow your students and track what you earn."
      actions={
        <Link href="/creator-dashboard/create-course" className="btn-primary">
          <PlusCircle size={18} /> New course
        </Link>
      }
    >
      {!user ? (
        <StudioLoading />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  {value === undefined ? (
                    <span className="mt-1 block h-7 w-16 animate-pulse rounded bg-slate-100" />
                  ) : (
                    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-slate-900">Your courses</h2>
              <Link
                href="/creator-dashboard/my-courses"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
              >
                Manage all <ArrowRight size={14} />
              </Link>
            </div>
            {courses === null ? (
              <div className="p-6">
                <StudioLoading />
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center p-10 text-center">
                <Layers size={32} className="text-slate-400" />
                <p className="mt-3 font-semibold text-slate-900">No courses yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Turn your YouTube lessons into your first paid course.
                </p>
                <Link href="/creator-dashboard/create-course" className="btn-primary mt-5">
                  Create a course
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <li key={c.id} className="flex items-center gap-4 px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.thumbnail || "/images/Thumbnail.jpg"}
                      alt=""
                      className="h-14 w-24 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link href={courseHref(c)} className="block truncate font-semibold text-slate-900 hover:text-brand-700">
                        {c.title?.trim()}
                      </Link>
                      <p className="text-sm text-slate-500">
                        {formatPrice(c.price)} · {enrollments[c.id] ?? "–"} enrolled
                      </p>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                      <Link href={`/creator-dashboard/${c.id}/create-chapters`} className="btn-secondary px-3 py-2">
                        Chapters
                      </Link>
                      <Link href={`/courses/${c.id}/edit`} className="btn-secondary px-3 py-2">
                        Edit
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/creator-dashboard/enrollments",
                icon: Users,
                title: "Enrollments",
                body: "See who joined each of your courses.",
              },
              {
                href: "/creator-dashboard/earnings",
                icon: Wallet,
                title: "Earnings",
                body: "Monthly revenue, your 80% share and payouts.",
              },
            ].map(({ href, icon: Icon, title, body }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600">
                  <Icon size={20} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500">{body}</p>
                </div>
                <ArrowRight size={18} className="text-slate-400 group-hover:text-brand-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </StudioShell>
  );
};

export default CreatorDashboard;
