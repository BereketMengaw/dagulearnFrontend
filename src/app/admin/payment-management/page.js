"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EarningsManagement() {
  const router = useRouter();
  const [earnings, setEarnings] = useState([]);
  const [creatorDetails, setCreatorDetails] = useState({}); // Store creator details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect to login if not admin or not logged in
    }
  }, [router]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/earnings`);
      if (!response.ok) throw new Error("Failed to fetch earnings");

      const data = await response.json();
      setEarnings(data);
      setLoading(false);

      // Fetch creator details for each unique creator in the earnings data
      const uniqueCreatorIds = [
        ...new Set(data.map((earning) => earning.creatorId)),
      ];
      fetchCreatorDetails(uniqueCreatorIds);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setError("Failed to load earnings. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch creator details for each unique creator ID
  const fetchCreatorDetails = async (creatorIds) => {
    try {
      const details = {};
      for (const creatorId of creatorIds) {
        const response = await fetch(
          `${apiUrl}/api/creator/creators/${creatorId}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch details for creator ${creatorId}`);
        const data = await response.json();
        details[creatorId] = data;
      }
      setCreatorDetails(details);
      console.log(details[1].creator.bankAccount, "this is the details");
    } catch (error) {
      console.error("Error fetching creator details:", error);
      setError("Failed to load creator details. Please try again later.");
    }
  };

  // Group earnings by month
  const groupEarningsByMonth = (earnings) => {
    return earnings.reduce((acc, earning) => {
      const monthKey = `${earning.year}-${earning.month}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(earning);
      return acc;
    }, {});
  };

  // Calculate net earnings (20% less than total earnings)
  const calculateNetEarnings = (totalEarnings) => {
    return totalEarnings * 0.8; // 20% decrease
  };

  const earningsByMonth = groupEarningsByMonth(earnings);

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 text-center">
        Earnings Management
      </h1>

      {loading ? (
        <p>Loading earnings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {Object.keys(earningsByMonth).map((monthKey) => {
            const [year, month] = monthKey.split("-");
            const monthName = new Date(year, month - 1).toLocaleString(
              "default",
              {
                month: "long",
              }
            );
            const monthEarnings = earningsByMonth[monthKey];

            // Calculate total earnings for the month
            const totalEarnings = monthEarnings.reduce(
              (total, earning) => total + earning.totalEarnings,
              0
            );

            // Calculate net earnings for the month
            const netEarnings = calculateNetEarnings(totalEarnings);

            return (
              <div key={monthKey} className="border p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Earnings for {monthName} {year}
                </h2>

                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Creator ID</th>
                      <th className="py-2 px-4 border-b">Account Number</th>
                      <th className="py-2 px-4 border-b">Bank Name</th>

                      <th className="py-2 px-4 border-b">Course ID</th>
                      <th className="py-2 px-4 border-b">Earnings</th>
                      <th className="py-2 px-4 border-b">Net Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthEarnings.map((earning) => {
                      const creatorNetEarnings = calculateNetEarnings(
                        earning.totalEarnings
                      );
                      const creatorDetail = creatorDetails[earning.creatorId];

                      const accountNumber =
                        creatorDetail?.creator.bankAccount || "N/A"; // Ensure it gets the bank account or shows "N/A"

                      const bankName = creatorDetail?.creator.bankType;
                      //                      console.log(bankName, "this is the bank name");

                      return (
                        <tr key={earning.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b text-center">
                            {earning.creatorId}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {accountNumber}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {bankName}
                          </td>

                          <td className="py-2 px-4 border-b text-center">
                            {earning.courseId}
                          </td>

                          <td className="py-2 px-4 border-b text-center">
                            {earning.totalEarnings} ETB
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {creatorNetEarnings.toFixed(2)} ETB
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="3"
                        className="py-2 px-4 border-t font-semibold text-right"
                      >
                        Total Earnings:
                      </td>
                      <td className="py-2 px-4 border-t text-center font-semibold">
                        {totalEarnings} ETB
                      </td>
                      <td className="py-2 px-4 border-t"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="3"
                        className="py-2 px-4 border-t font-semibold text-right"
                      >
                        Net Earnings By Creators (20% less):
                      </td>
                      <td className="py-2 px-4 border-t text-center font-semibold">
                        {netEarnings.toFixed(2)} ETB
                      </td>
                      <td className="py-2 px-4 border-t"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
