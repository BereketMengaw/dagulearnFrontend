"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect to login if not admin or not logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Management */}
        <button
          onClick={() => router.push("/admin/course-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">Course Management</h2>
          <p className="text-gray-600">
            Manage courses, add new courses, or edit existing ones.
          </p>
        </button>

        {/* User Management */}
        <button
          onClick={() => router.push("/admin/user-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">
            Manage user accounts, roles, and permissions.
          </p>
        </button>

        {/* Video Management */}
        <button
          onClick={() => router.push("/admin/video-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">Video Management</h2>
          <p className="text-gray-600">
            Upload, edit, or delete videos for courses.
          </p>
        </button>

        {/* Link Management */}
        <button
          onClick={() => router.push("/admin/link-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">Link Management</h2>
          <p className="text-gray-600">
            Manage external or internal links for courses.
          </p>
        </button>

        {/* Enrollment Management */}
        <button
          onClick={() => router.push("/admin/enrollment-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">Enrollment Management</h2>
          <p className="text-gray-600">
            Track and manage user enrollments in courses.
          </p>
        </button>

        {/* Payment Management */}
        <button
          onClick={() => router.push("/admin/payment-management")}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-semibold mb-2">Payment Management</h2>
          <p className="text-gray-600">View and manage payment records.</p>
        </button>
      </div>
    </div>
  );
}
