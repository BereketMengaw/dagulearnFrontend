"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Wallet, BookOpen, ArrowLeft } from "lucide-react";
import StudioShell, { Card, StudioLoading } from "@/components/studio/StudioShell";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Only access localStorage on the client-side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCreatorId(parsedUser.userId);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  // ✅ Check if user is a creator
  const { creator, loading: checkingCreator } = useCheckCreator(
    userData?.userId
  );

  useEffect(() => {
    // If creator check is done and user is not a creator or no creator data, redirect
    if (!checkingCreator && (creator === false || creator === null)) {
      setNotice("First fill in your creator information.");
      router.push("/creator-dashboard/register");
    }
  }, [checkingCreator, creator, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!creatorId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/api/courses/creator/${creatorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [creatorId]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!courses.length) return;
      setLoading(true);
      try {
        const enrollmentsData = [];
        let total = 0;
        for (const course of courses) {
          console.log(`Fetching enrollments for course: ${course.id}`);
          try {
            const response = await fetch(
              `${apiUrl}/api/enrollments/course/${course.id}`
            );
            if (!response.ok) {
              continue;
            }

            const data = await response.json();
            console.log(`Enrollments for course ${course.id}:`, data);
            enrollmentsData.push({ course, enrollments: data });

            const courseEarnings = data.reduce(
              (sum, enrollment) =>
                sum + parseFloat(enrollment.course.price || 0),
              0
            );
            total += courseEarnings;
          } catch (err) {
            console.error(
              `Error fetching enrollments for course ${course.id}:`,
              err.message
            );
          }
        }
        setEnrollments(enrollmentsData);
        setTotalEarnings(total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [courses]);

  const totalStudents = enrollments.reduce((n, e) => n + e.enrollments.length, 0);

  const stats = [
    { label: "Courses", value: courses.length, icon: BookOpen },
    { label: "Total enrollments", value: totalStudents, icon: Users },
    { label: "Gross sales", value: `${totalEarnings.toLocaleString()} ETB`, icon: Wallet },
  ];

  return (
    <StudioShell
      title="Enrollments"
      subtitle="Who has bought each of your courses."
      actions={
        <Link href="/creator-dashboard" className="btn-secondary">
          <ArrowLeft size={16} /> Back to overview
        </Link>
      }
    >
      {notice && (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</p>
      )}

      {loading ? (
        <StudioLoading />
      ) : error ? (
        <Card className="text-center">
          <p className="font-semibold text-red-700">Error: {error}</p>
          <button onClick={() => router.push("/creator-dashboard")} className="btn-secondary mt-4">
            Return to dashboard
          </button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                </div>
              </Card>
            ))}
          </div>

          {courses.length === 0 ? (
            <Card className="text-center text-slate-500">No courses found.</Card>
          ) : (
            courses.map((course) => {
              const courseEnrollments =
                enrollments.find((e) => e.course.id === course.id)?.enrollments || [];
              const courseEarnings = courseEnrollments.reduce(
                (sum, enrollment) => sum + parseFloat(enrollment.course.price || 0),
                0
              );

              return (
                <Card key={course.id} className="p-0">
                  <div className="flex flex-col gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-900">{course.title?.trim()}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                        {courseEnrollments.length} enrolled
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        {courseEarnings.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Student ID</th>
                          <th className="px-6 py-3 font-semibold">Price</th>
                          <th className="px-6 py-3 font-semibold">Enrolled at</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {courseEnrollments.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="px-6 py-6 text-center text-slate-500">
                              No enrollments for this course yet.
                            </td>
                          </tr>
                        ) : (
                          courseEnrollments.map((enrollment) => (
                            <tr key={enrollment.id} className="hover:bg-slate-50">
                              <td className="px-6 py-3 font-medium text-slate-900">#{enrollment.userId}</td>
                              <td className="px-6 py-3 text-slate-700">{enrollment.course.price} ETB</td>
                              <td className="px-6 py-3 text-slate-500">
                                {new Date(enrollment.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </StudioShell>
  );
}
