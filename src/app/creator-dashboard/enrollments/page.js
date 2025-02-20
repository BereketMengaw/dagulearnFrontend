"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
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
          const response = await fetch(
            `${apiUrl}/api/enrollments/course/${course.id}`
          );
          if (!response.ok)
            throw new Error(
              "THERE IS NO ENROLLMENT FOR THE COURSES UNTIL NOW "
            );
          const data = await response.json();
          enrollmentsData.push({ course, enrollments: data });

          const courseEarnings = data.reduce(
            (sum, enrollment) => sum + parseFloat(enrollment.course.price || 0),
            0
          );
          total += courseEarnings;
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
        <ClipLoader color="#4A90E2" size={50} />
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Course Enrollments
        </h1>
        {enrollments.length === 0 ? (
          <p className="text-gray-500">
            No enrollments found for your courses.
          </p>
        ) : (
          <div className="space-y-8">
            {enrollments.map(({ course, enrollments }) => {
              const courseEarnings = enrollments.reduce(
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
                  <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="min-w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            User ID
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Enrolled At
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.length === 0 ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-4 text-gray-500"
                            >
                              No enrollments found for this course.
                            </td>
                          </tr>
                        ) : (
                          enrollments.map((enrollment) => (
                            <tr
                              key={enrollment.id}
                              className="border-b hover:bg-gray-50 transition duration-200"
                            >
                              <td className="px-6 py-3">{enrollment.userId}</td>
                              <td className="px-6 py-3">
                                {enrollment.course.price} ETB
                              </td>
                              <td className="px-6 py-3">
                                {new Date(
                                  enrollment.createdAt
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 font-semibold text-lg text-green-600">
                    Total Earnings for this Course: {courseEarnings} ETB
                  </div>
                </div>
              );
            })}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-800">
                Total Earnings from All Courses: {totalEarnings} ETB
              </div>
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/creator-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
        <footer className="mt-8 text-center text-gray-500">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
