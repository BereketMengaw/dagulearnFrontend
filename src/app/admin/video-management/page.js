"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoManagement() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null); // State to manage the video being edited
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to manage update success message

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect to login if not admin or not logged in
    }
  }, [router]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/videos`);
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again later.");
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    // Confirm before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!isConfirmed) return; // Exit if the user cancels

    try {
      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete video");
      }
      setVideos(videos.filter((video) => video.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Failed to delete video. Please try again.");
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video); // Set the video to be edited
    setUpdateSuccess(false); // Reset the update success message
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/videos/${editingVideo.id}`, {
        method: "PUT", // or "PATCH" depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingVideo),
      });
      if (!response.ok) {
        throw new Error("Failed to update video");
      }
      const updatedVideo = await response.json();
      setVideos(
        videos.map((video) =>
          video.id === updatedVideo.id ? updatedVideo : video
        )
      );
      setEditingVideo(null); // Clear the editing state
      setUpdateSuccess(true); // Show success message
    } catch (error) {
      console.error("Error updating video:", error);
      setError("Failed to update video. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo((prevVideo) => ({
      ...prevVideo,
      [name]: value,
    }));
  };

  // Group videos by courseId
  const groupVideosByCourseId = () => {
    const groupedVideos = {};
    videos.forEach((video) => {
      if (!groupedVideos[video.courseId]) {
        groupedVideos[video.courseId] = [];
      }
      groupedVideos[video.courseId].push(video);
    });
    return groupedVideos;
  };

  const groupedVideos = groupVideosByCourseId();

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 text-center">Video Management</h1>
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Video updated successfully!
        </div>
      )}
      {loading ? (
        <p>Loading videos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedVideos).map((courseId) => (
            <div key={courseId} className="space-y-4">
              <h2 className="text-xl font-semibold">Course {courseId}</h2>
              {groupedVideos[courseId].map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-600">
                      Chapter {video.chapterId} - Order {video.order}
                    </p>
                    <p className="text-sm text-gray-600">{video.description}</p>
                    <p className="text-sm text-gray-500">
                      URL:{" "}
                      <a
                        href={video.url}
                        className="text-blue-500 hover:underline"
                      >
                        {video.url}
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(video.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Video</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingVideo.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4"></div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  type="text"
                  name="url"
                  value={editingVideo.url}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Chapter ID
                </label>
                <input
                  type="number"
                  name="chapterId"
                  value={editingVideo.chapterId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={editingVideo.order}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
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
