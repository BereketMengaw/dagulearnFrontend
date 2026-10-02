"use client"; // This ensures the code runs only on the client side

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Percent, CalendarDays, Landmark, FileText, TrendingUp } from "lucide-react";
import StudioShell, { Card, StudioLoading, maskAccount } from "@/components/studio/StudioShell";
import { fetchEarningsByCreatorId } from "../../../lib/fetcher"; // Import the fetcher function
import { useRouter } from "next/navigation";
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function EarningsPage() {
  const router = useRouter(); // ✅ Initialize router
  const [earnings, setEarnings] = useState([]); // Stores all earnings data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [creatorId, setCreatorId] = useState(null); // Creator ID from localStorage
  const [userData, setUserData] = useState(null); // Stores user data
  const [notice, setNotice] = useState("");

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
      setNotice("First fill in your creator information.");
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

  const months = Object.entries(monthlyEarnings);
  const totalCreator = months.reduce((n, [, d]) => n + d.totalCreatorEarnings, 0);
  const totalPlatform = months.reduce((n, [, d]) => n + d.totalPlatformCommission, 0);
  const now = new Date();
  const thisMonthKey = `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
  const thisMonth = monthlyEarnings[thisMonthKey]?.totalCreatorEarnings || 0;
  const fmt = (n) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

  const stats = [
    { label: "Your total earnings", value: fmt(totalCreator), icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
    { label: "This month", value: fmt(thisMonth), icon: CalendarDays, tone: "bg-brand-50 text-brand-600" },
    { label: "Platform commission (20%)", value: fmt(totalPlatform), icon: Percent, tone: "bg-slate-100 text-slate-600" },
  ];

  return (
    <StudioShell
      title="Earnings"
      subtitle="You keep 80% of every sale. Payouts go to your bank account at the end of each month."
      actions={
        <Link href="/creator-agreement" className="btn-secondary">
          <FileText size={16} /> Creator agreement
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
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <Card key={label}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Landmark size={20} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Payout account</p>
                <p className="font-semibold text-slate-900">
                  {creator?.bankType || "No bank set"} · {maskAccount(creator?.bankAccount)}
                </p>
              </div>
            </div>
            <Link href="/creator-dashboard/register" className="text-sm font-semibold text-brand-700 hover:underline">
              Update payout details
            </Link>
          </Card>

          {months.length === 0 ? (
            <Card className="flex flex-col items-center py-12 text-center">
              <TrendingUp size={32} className="text-slate-300" />
              <h2 className="mt-3 font-semibold text-slate-900">No earnings yet</h2>
              <p className="mt-1 text-sm text-slate-500">
                You have no earnings to display at this time.
              </p>
            </Card>
          ) : (
            months.map(([monthYear, data]) => (
              <Card key={monthYear} className="p-0">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-slate-900">{monthYear}</h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {fmt(data.totalCreatorEarnings)}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Course</th>
                        <th className="px-6 py-3 text-right font-semibold">You (80%)</th>
                        <th className="px-6 py-3 text-right font-semibold">Platform (20%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(data.courses).map(([courseTitle, { creatorEarnings, platformCommission }]) => (
                        <tr key={courseTitle} className="hover:bg-slate-50">
                          <td className="px-6 py-3 font-medium text-slate-900">{courseTitle}</td>
                          <td className="px-6 py-3 text-right font-semibold text-emerald-700">{fmt(creatorEarnings)}</td>
                          <td className="px-6 py-3 text-right text-slate-500">{fmt(platformCommission)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 bg-slate-50/60">
                      <tr>
                        <td className="px-6 py-3 font-bold text-slate-900">Total</td>
                        <td className="px-6 py-3 text-right font-bold text-slate-900">{fmt(data.totalCreatorEarnings)}</td>
                        <td className="px-6 py-3 text-right text-slate-500">{fmt(data.totalPlatformCommission)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <p className="px-6 py-4 text-xs text-slate-500">
                  This amount will be paid to your account by the end of the month.
                </p>
              </Card>
            ))
          )}
        </div>
      )}
    </StudioShell>
  );
}
