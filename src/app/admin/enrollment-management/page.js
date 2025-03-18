"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEnrollment, setEditingEnrollment] = useState(null); // State to manage the enrollment being edited
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to manage update success message
  const [showAddForm, setShowAddForm] = useState(false); // State to manage the add enrollment form visibility
  const [newEnrollment, setNewEnrollment] = useState({
    userId: "",
    courseId: "",
  }); // State to manage new enrollment data
  const [courseIdFilter, setCourseIdFilter] = useState(""); // State to manage the course ID filter

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect to login if not admin or not logged in
    }
  }, [router]);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        "https://dagulearnbackend-production.up.railway.app/api/enrollments"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }
      const data = await response.json();
      setEnrollments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setError("Failed to load enrollments. Please try again later.");
      setLoading(false);
    }
  };

  const deleteEnrollment = async (enrollmentId) => {
    // Confirm before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );
    if (!isConfirmed) return; // Exit if the user cancels

    try {
      const response = await fetch(
        `https://dagulearnbackend-production.up.railway.app/api/enrollments/${enrollmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete enrollment");
      }
      setEnrollments(
        enrollments.filter((enrollment) => enrollment.id !== enrollmentId)
      );
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      setError("Failed to delete enrollment. Please try again.");
    }
  };

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment); // Set the enrollment to be edited
    setUpdateSuccess(false); // Reset the update success message
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://dagulearnbackend-production.up.railway.app/api/enrollments/${editingEnrollment.id}`,
        {
          method: "PUT", // or "PATCH" depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingEnrollment),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update enrollment");
      }
      const updatedEnrollment = await response.json();
      setEnrollments(
        enrollments.map((enrollment) =>
          enrollment.id === updatedEnrollment.id
            ? updatedEnrollment
            : enrollment
        )
      );
      setEditingEnrollment(null); // Clear the editing state
      setUpdateSuccess(true); // Show success message
    } catch (error) {
      console.error("Error updating enrollment:", error);
      setError("Failed to update enrollment. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingEnrollment) {
      setEditingEnrollment((prevEnrollment) => ({
        ...prevEnrollment,
        [name]: value,
      }));
    } else {
      setNewEnrollment((prevEnrollment) => ({
        ...prevEnrollment,
        [name]: value,
      }));
    }
  };

  const handleAddEnrollment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://dagulearnbackend-production.up.railway.app/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEnrollment),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add enrollment");
      }
      const data = await response.json();
      setEnrollments([...enrollments, data]); // Add the new enrollment to the list
      setNewEnrollment({ userId: "", courseId: "" }); // Reset the form
      setShowAddForm(false); // Hide the add form
      setUpdateSuccess(true); // Show success message
    } catch (error) {
      console.error("Error adding enrollment:", error);
      setError("Failed to add enrollment. Please try again.");
    }
  };

  // Filter enrollments based on course ID
  const filteredEnrollments = courseIdFilter
    ? enrollments.filter(
        (enrollment) => enrollment.courseId === parseInt(courseIdFilter)
      )
    : enrollments;

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Enrollment Management</h1>
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Operation successful!
        </div>
      )}
      {loading ? (
        <p>Loading enrollments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showAddForm ? "Hide Add Form" : "Add New Enrollment"}
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Course ID
              </label>
              <input
                type="number"
                value={courseIdFilter}
                onChange={(e) => setCourseIdFilter(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Course ID"
              />
            </div>
          </div>
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Enrollment</h2>
              <form onSubmit={handleAddEnrollment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <input
                    type="number"
                    name="userId"
                    value={newEnrollment.userId}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Course ID
                  </label>
                  <input
                    type="number"
                    name="courseId"
                    value={newEnrollment.courseId}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Enrollment
                  </button>
                </div>
              </form>
            </div>
          )}
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  Enrollment ID: {enrollment.id}
                </h3>
                <p className="text-sm text-gray-600">
                  User ID: {enrollment.userId} | Course ID:{" "}
                  {enrollment.courseId}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(enrollment)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEnrollment(enrollment.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="number"
                  name="userId"
                  value={editingEnrollment.userId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Course ID
                </label>
                <input
                  type="number"
                  name="courseId"
                  value={editingEnrollment.courseId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEnrollment(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
