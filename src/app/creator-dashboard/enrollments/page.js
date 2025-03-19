"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Load from "@/components/load/page";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Import the table components

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
      alert("First fill creator information.");
      router.push(
        "${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register"
      );
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Load />
      </div>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error: {error}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() =>
              router.push(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/creator-dashboard`
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 mx-10">
          My Course Enrollments
        </h1>
        <div className="space-y-8">
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses found.</p>
          ) : (
            courses.map((course) => {
              const courseEnrollments =
                enrollments.find((e) => e.course.id === course.id)
                  ?.enrollments || [];
              const courseEarnings = courseEnrollments.reduce(
                (sum, enrollment) =>
                  sum + parseFloat(enrollment.course.price || 0),
                0
              );

              return (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-lg shadow-md space-y-4"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    Course Title: {course.title}
                  </h2>
                  <p className="text-gray-600">{course.description}</p>
                  <Table>
                    <TableCaption>
                      A list of your recent enrollments.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Enrolled At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseEnrollments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan="3">
                            No enrollments found for this course.
                          </TableCell>
                        </TableRow>
                      ) : (
                        courseEnrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell>{enrollment.userId}</TableCell>
                            <TableCell>{enrollment.course.price} ETB</TableCell>
                            <TableCell>
                              {new Date(enrollment.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                
                </div>
              );
            })
          )}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-800">
              Total Earnings from All Courses: {totalEarnings} ETB
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/creator-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
