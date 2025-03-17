"use client"; // This ensures the code runs only on the client side

import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { fetchEarningsByCreatorId } from "../../../lib/fetcher"; // Import the fetcher function
import { useRouter } from "next/navigation";
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware
import Load from "@/components/load/page";
import { Button } from "@material-tailwind/react";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function EarningsPage() {
  const router = useRouter(); // ✅ Initialize router
  const [earnings, setEarnings] = useState([]); // Stores all earnings data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [creatorId, setCreatorId] = useState(null); // Creator ID from localStorage
  const [userData, setUserData] = useState(null); // Stores user data
  const [bankAcc, setBankAcc] = useState();

  // Fetch user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setCreatorId(parsedUser.userId); // Set creatorId from user data
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
        `${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register`
      );
    }
  }, [checkingCreator, creator, router]);

  // Fetch earnings data
  useEffect(() => {
    const fetchEarnings = async () => {
      if (!creatorId) return;
      setLoading(true);
      try {
        const data = await fetchEarningsByCreatorId(creatorId); // Use the fetcher function

        // For each earning, fetch the course title using the courseId
        const earningsWithCourseTitles = await Promise.all(
          data.map(async (earning) => {
            const courseResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${earning.courseId}`
            );
            const courseData = await courseResponse.json();
            return {
              ...earning,
              courseTitle: courseData.title, // Add the course title to the earning object
            };
          })
        );

        setEarnings(earningsWithCourseTitles);
      } catch (err) {
        setError(err.message);
        console.log(creatorId);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [creatorId]);

  // Organize earnings by month and calculate 80% for creator and 20% for platform
  const organizeEarningsByMonth = (earnings) => {
    const monthlyEarnings = {};

    earnings.forEach((earning) => {
      const date = new Date(earning.createdAt);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!monthlyEarnings[monthYear]) {
        monthlyEarnings[monthYear] = {
          totalCreatorEarnings: 0, // Total earnings for the creator (80%)
          totalPlatformCommission: 0, // Total commission for the platform (20%)
          courses: {},
        };
      }

      if (!monthlyEarnings[monthYear].courses[earning.courseTitle]) {
        monthlyEarnings[monthYear].courses[earning.courseTitle] = {
          creatorEarnings: 0, // Creator's earnings for this course (80%)
          platformCommission: 0, // Platform's commission for this course (20%)
        };
      }

      // Calculate 80% for creator and 20% for platform
      const creatorShare = earning.totalEarnings * 0.8;
      const platformCommission = earning.totalEarnings * 0.2;

      monthlyEarnings[monthYear].courses[earning.courseTitle].creatorEarnings +=
        creatorShare;
      monthlyEarnings[monthYear].courses[
        earning.courseTitle
      ].platformCommission += platformCommission;

      monthlyEarnings[monthYear].totalCreatorEarnings += creatorShare;
      monthlyEarnings[monthYear].totalPlatformCommission += platformCommission;
    });

    return monthlyEarnings;
  };

  const monthlyEarnings = organizeEarningsByMonth(earnings);

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
            onClick={() => router.push("/creator-dashboard")}
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
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          My Earnings
        </h1>
        <div className="space-y-8">
          {Object.keys(monthlyEarnings).length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                No Earnings Found
              </h2>
              <p className="text-gray-500">
                You have no earnings to display at this time.
              </p>
            </div>
          ) : (
            Object.entries(monthlyEarnings).map(([monthYear, data]) => (
              <div
                key={monthYear}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {monthYear}
                </h2>
                <div className="space-y-4">
                  {Object.entries(data.courses).map(
                    ([
                      courseTitle,
                      { creatorEarnings, platformCommission },
                    ]) => (
                      <div
                        key={courseTitle}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <p className="text-gray-600">{courseTitle}</p>
                        <div className="text-right">
                          <p className="text-green-600 font-semibold">
                            Creator: {creatorEarnings.toFixed(2)} ETB
                          </p>
                          <p className="text-gray-500 text-sm">
                            Platform: {platformCommission.toFixed(2)} ETB
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-bold text-blue-800">
                    Total Earnings for {monthYear}:{" "}
                    {data.totalCreatorEarnings.toFixed(2)} ETB
                  </p>
                  <p className="text-gray-500 text-sm">
                    Platform Commission:{" "}
                    {data.totalPlatformCommission.toFixed(2)} ETB
                  </p>
                  <span className="text-gray-500 font-mono">
                    This Amount will be funded to your account by the end of
                    every month.
                  </span>

                  <div className="text-gray-500 font-mono">
                    Bank Account: {creator.bankAccount}
                  </div>

                  <span className="text-gray-500 font-mono">
                    {creator.bankType}
                  </span>
                </div>
                <button onClick={() => router.push("/creator-agreement")}>
                  View creator agreement
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-10">
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
}
