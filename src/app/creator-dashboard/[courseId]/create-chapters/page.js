"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useChapterAndVideo from "@/hooks/useChapterAndVideo";
import { addLink } from "@/hooks/linkAdder"; // Import the fetcher function
import Link from "next/link";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ChapterAndVideoForm = () => {
  const { courseId } = useParams(); // Extract courseId from URL
  const { chapters, isLoading, addChapter, addVideo } =
    useChapterAndVideo(courseId);
  const [newChapter, setNewChapter] = useState({ title: "", order: "" });
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    chapterId: "",
  });
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    chapterId: "",
    order: "",
  });
  const [courseCreatorId, setCourseCreatorId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchCourseInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/courses/${courseId}`);
        const courseData = await response.json();
        setCourseCreatorId(courseData.creatorId);

        // Check if the user is the creator or admin
        if (courseData.creatorId !== user?.userId && user?.role !== "admin") {
          router.push("/"); // Redirect to home if not authorized
        }
      } catch (error) {
        console.error("Failed to fetch course info:", error);
      }
    };

    if (courseId && user) {
      fetchCourseInfo();
    }
  }, [courseId, user?.userId, user?.role, router]); // Use specific user properties to prevent infinite loop

  const handleChapterSelection = (e, type) => {
    const selectedChapterId = e.target.value;
    const selectedChapter = chapters.find(
      (chapter) => chapter.id === parseInt(selectedChapterId)
    );

    if (selectedChapter) {
      if (type === "video") {
        setNewVideo({
          ...newVideo,
          chapterId: selectedChapterId,
          order: selectedChapter.order, // Sync order with chapter
        });
      } else if (type === "link") {
        setNewLink({
          ...newLink,
          chapterId: selectedChapterId,
          order: selectedChapter.order, // Sync order with chapter
        });
      }
    }
  };

  const handleChapterSubmit = async () => {
    if (!newChapter.title.trim() || !newChapter.order) {
      alert("Chapter title and order are required.");
      return;
    }
    await addChapter(newChapter);
    setNewChapter({ title: "", order: "" });
  };

  const handleVideoSubmit = async () => {
    if (!newVideo.chapterId || !newVideo.title.trim() || !newVideo.url.trim()) {
      alert("All fields are required.");
      return;
    }

    await addVideo({
      title: newVideo.title,
      url: newVideo.url,
      chapterId: newVideo.chapterId,
      order: newVideo.order, // Ensuring the order matches the selected chapter
    });

    setNewVideo({ title: "", url: "", chapterId: "", order: "" });
  };

  const handleLinkSubmit = async () => {
    if (
      !newLink.chapterId ||
      !newLink.title.trim() ||
      !newLink.url.trim() ||
      !newLink.order
    ) {
      alert("All link fields are required.");
      return;
    }

    try {
      await addLink({
        title: newLink.title,
        url: newLink.url,
        chapterId: parseInt(newLink.chapterId),
        order: parseInt(newLink.order),
      });

      alert("Link uploaded successfully!");
      setNewLink({ title: "", url: "", chapterId: "", order: "" });
    } catch (error) {
      alert("Failed to upload link. Please try again.");
    }
  };

  const handleButtonClick = () => {
    // Redirect to the dynamic course update page
    router.push(`/courses/${courseId}/edit`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Manage Chapters & Videos</h1>

        {/* Add Chapter Form */}
        <div className="mb-6 p-4 border rounded bg-white shadow-md">
          <h2 className="text-lg font-semibold">Add Chapter</h2>
          <input
            type="text"
            placeholder="Chapter Title"
            className="w-full p-2 border rounded mb-2"
            value={newChapter.title}
            onChange={(e) =>
              setNewChapter({ ...newChapter, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Order"
            className="w-full p-2 border rounded mb-2"
            value={newChapter.order}
            onChange={(e) =>
              setNewChapter({ ...newChapter, order: e.target.value })
            }
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleChapterSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Chapter"}
          </button>
        </div>

        {/* Add Video Form */}
        <div className="mb-6 p-4 border rounded bg-white shadow-md">
          <h2 className="text-lg font-semibold">Add Video</h2>
          <select
            className="w-full p-2 border rounded mb-2"
            value={newVideo.chapterId}
            onChange={(e) => handleChapterSelection(e, "video")} // Pass "video" explicitly
          >
            <option value="">Select Chapter</option>
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title} (Order: {chapter.order})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No chapters available
              </option>
            )}
          </select>

          <input
            type="text"
            placeholder="Video Title"
            className="w-full p-2 border rounded mb-2"
            value={newVideo.title}
            onChange={(e) =>
              setNewVideo({ ...newVideo, title: e.target.value })
            }
          />
          <input
            type="url"
            placeholder="Video URL"
            className="w-full p-2 border rounded mb-2"
            value={newVideo.url}
            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
          />
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleVideoSubmit}
            disabled={isLoading || chapters.length === 0}
          >
            {isLoading ? "Uploading..." : "Add Video"}
          </button>
        </div>

        {/* Add Link Form */}
        <div className="mb-6 p-4 border rounded bg-white shadow-md">
          <h2 className="text-lg font-semibold">Add Link</h2>
          <select
            className="w-full p-2 border rounded mb-2"
            value={newLink.chapterId}
            onChange={(e) => handleChapterSelection(e, "link")} // Pass "link"
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title} (Order: {chapter.order})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Link Title"
            className="w-full p-2 border rounded mb-2"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />
          <input
            type="url"
            placeholder="Link URL"
            className="w-full p-2 border rounded mb-2"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />

          <button
            type="button"
            className="px-4 py-2 bg-purple-500 text-white rounded"
            onClick={handleLinkSubmit}
            disabled={isLoading || chapters.length === 0}
          >
            {isLoading ? "Uploading..." : "Add Link"}
          </button>
        </div>

        {/* Display Existing Chapters for the Current Course */}
        <h2 className="text-lg font-semibold mb-4">Existing Chapters</h2>
        {chapters.length === 0 ? (
          <p className="text-gray-500">
            No chapters added for this course yet.
          </p>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="mb-4 p-4 border rounded bg-white shadow-md"
            >
              <h3 className="text-md font-medium">
                {chapter.title} (Order: {chapter.order})
                <Link
                  href={`/courses/${courseId}/chapters/${chapter.order}/edit`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit Chapter
                </Link>
              </h3>
            </div>
          ))
        )}
      </div>
      <Link href={`/courses/${courseId}/edit`}>
        <button
          type="button"
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading || chapters.length === 0}
        >
          Update Course
        </button>
      </Link>
    </>
  );
};

export default ChapterAndVideoForm;
