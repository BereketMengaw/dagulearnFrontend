"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Load from "@/components/load/page";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import { fetchCreator } from "@/lib/fetcher"; // Import the fetcher function
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CreatorDashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Guest"); // State for user's name
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userId, setuserId] = useState(null);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login"); // Redirect to login if no user is found
        return; // exit early if no user
      }

      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "Guest"); // Set the user's name
      setuserId(parsedUser.userId);
    }
  }, [router]); // Empty dependency array ensures it runs once when component mounts

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const creatorData = await fetchCreator(userId); // Fetch creator data
        setUser(creatorData);
        console.log(creatorData);
      } catch (error) {
        router.push("/noAccess");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, router]); // Added `userId` to the dependency array

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
      router.push(
        `${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register`
      );
    }
  }, [checkingCreator, creator, router]);

  if (!user) {
    return <Load />;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-lg mb-8 text-center md:text-left transition-shadow hover:shadow-xl">
          <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4 rock-salt-regular">
            👋 Hello, <>{userName}! </> Welcome to Your Creator Dashboard!
          </h1>
          <p className="text-gray-600 text-lg md:text-xl cursive-regular ml-28 ">
            Manage your courses, upload new ones, and track your progress here.
          </p>
        </header>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link href="/creator-dashboard/create-course">
            <div className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105">
              <h2 className="text-2xl md:text-3xl cursive-regular font-bold mb-4">
                📝 Create a Course
              </h2>
              <p className="text-lg md:text-xl">
                Start uploading a new course and share your knowledge!
              </p>
            </div>
          </Link>

          <Link href="/creator-dashboard/my-courses">
            <div className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 cursive-regular ">
                📚 My Courses
              </h2>
              <p className="text-lg md:text-xl">
                View and manage all the courses you have created.
              </p>
            </div>
          </Link>

          <Link href="/creator-dashboard/enrollments">
            <div className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 cursive-regular">
                👥 Enrollments
              </h2>
              <p className="text-lg md:text-xl">
                Check the students enrolled in your courses.
              </p>
            </div>
          </Link>

          <Link href="/creator-dashboard/earnings">
            <div className="cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 cursive-regular">
                💰 Earnings
              </h2>
              <p className="text-lg md:text-xl">
                Track your revenue from courses.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreatorDashboard;
