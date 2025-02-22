"use client";

//to check git

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchContentByChapterAndCourse } from "@/lib/fetcher";
import Navbar from "@/components/Navbar/Navbar";
import { apiUrl } from "@/lib/api";
import { appUrl } from "@/app/creator-dashboard/register/page";

export default function UpdateChapterPage() {
  const params = useParams();
  const { ID: courseId, chapterId } = params || {};
  const router = useRouter();

  const [content, setContent] = useState({
    title: "",
    videos: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [courseCreatorId, setCourseCreatorId] = useState(null);
  const [chapterOrder, setChapterOrder] = useState(null);

  useEffect(() => {
    if (!courseId || !chapterId) return;

    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        // Fetch course info
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`
        );
        if (!courseResponse.ok) throw new Error("Failed to fetch course info.");

        const courseData = await courseResponse.json();
        setCourseCreatorId(courseData.creatorId);

        // Get user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Check if user is the creator of the course or an admin
          if (
            parsedUser.userId !== courseData.creatorId &&
            parsedUser.role !== "admin"
          ) {
            router.push("/");
            return;
          }
        } else {
          router.push("/");
          return;
        }

        // Fetch chapter content
        const chapterResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chapters/${courseId}/chapters/${chapterId}`
        );
        if (!chapterResponse.ok)
          throw new Error("Failed to fetch chapter information.");

        const chapterData = await chapterResponse.json();
        setChapterOrder(chapterData.chapter.order); // Store the order

        const contentData = await fetchContentByChapterAndCourse(
          Number(courseId),
          Number(chapterId)
        );

        setContent({
          title: chapterData.chapter.title || "Untitled Chapter",
          videos: contentData.videos || [],
          links: contentData.links || [],
        });
      } catch (err) {
        setError("Failed to fetch content or course information.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [courseId, chapterId, router]);

  const handleDeleteVideo = async (videoId) => {
    try {
      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete video.");

      // Remove deleted video from state
      setContent((prevContent) => ({
        ...prevContent,
        videos: prevContent.videos.filter((video) => video.id !== videoId),
      }));
    } catch (err) {
      alert("Error deleting video");
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const response = await fetch(`${apiUrl}/api/link/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete link.");

      // Remove deleted link from state
      setContent((prevContent) => ({
        ...prevContent,
        links: prevContent.links.filter((link) => link.id !== linkId),
      }));
    } catch (err) {
      alert("Error deleting link");
    }
  };

  const handleUpdateChapter = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/chapters/${courseId}/chapters/order/${chapterId}.`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: content.title }),
        }
      );

      if (!response.ok) throw new Error("Failed to update chapter.");
    } catch (err) {
      alert("Error updating chapter");
    }
  };

  const handleUpdateVideo = async (videoId, updatedTitle, updatedUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, url: updatedUrl }),
      });
      alert("you have successfully updated the video");
      if (!response.ok) throw new Error("Failed to update video.");
    } catch (err) {
      alert("Error updating video");
    }
  };

  const handleUpdateLink = async (linkId, updatedTitle, updatedUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api/link/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, url: updatedUrl }),
      });

      alert("you have successfully updated the link");
      if (!response.ok) throw new Error("Failed to update link.");
    } catch (err) {
      alert("Error updating link");
    }
  };

  const handleNavigateToAddChapter = () => {
    router.push(`${appUrl}/creator-dashboard/${courseId}/create-chapters`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Update Chapter</h1>

        {/* Update Chapter Title */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">
            Chapter Title:
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleUpdateChapter}
            className="mt-2 p-2 bg-blue-600 text-white rounded-md"
          >
            Update Chapter
          </button>
        </div>

        {/* Update Videos */}
        <h2 className="text-xl font-semibold mt-6">Videos</h2>
        {content.videos.map((video) => (
          <div key={video.id} className="mb-4 p-4 border rounded-md bg-gray-50">
            <label className="block text-md font-medium">Video Title:</label>
            <input
              type="text"
              value={video.title}
              onChange={(e) => {
                const updatedVideos = content.videos.map((v) =>
                  v.id === video.id ? { ...v, title: e.target.value } : v
                );
                setContent({ ...content, videos: updatedVideos });
              }}
              className="w-full p-2 border rounded-md mb-2"
            />

            <label className="block text-md font-medium">Video URL:</label>
            <input
              type="text"
              value={video.url}
              onChange={(e) => {
                const updatedVideos = content.videos.map((v) =>
                  v.id === video.id ? { ...v, url: e.target.value } : v
                );
                setContent({ ...content, videos: updatedVideos });
              }}
              className="w-full p-2 border rounded-md"
            />

            <button
              onClick={() =>
                handleUpdateVideo(video.id, video.title, video.url)
              }
              className="mt-2 p-2 bg-green-600 text-white rounded-md mx-12"
            >
              Update Video
            </button>

            <button
              onClick={() => handleDeleteVideo(video.id)}
              className="p-2 bg-red-600 text-white rounded-md mx-12"
            >
              Delete Video
            </button>
          </div>
        ))}

        {/* Update Links */}
        <h2 className="text-xl font-semibold my-6">Links</h2>
        {content.links.map((link) => (
          <div key={link.id} className="mb-4 p-4 border rounded-md bg-gray-50">
            <label className="block text-md font-medium">Link Title:</label>
            <input
              type="text"
              value={link.title}
              onChange={(e) => {
                const updatedLinks = content.links.map((l) =>
                  l.id === link.id ? { ...l, title: e.target.value } : l
                );
                setContent({ ...content, links: updatedLinks });
              }}
              className="w-full p-2 border rounded-md mb-2"
            />

            <label className="block text-md font-medium">Link URL:</label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => {
                const updatedLinks = content.links.map((l) =>
                  l.id === link.id ? { ...l, url: e.target.value } : l
                );
                setContent({ ...content, links: updatedLinks });
              }}
              className="w-full p-2 border rounded-md"
            />

            <button
              onClick={() => handleUpdateLink(link.id, link.title, link.url)}
              className="mt-2 p-2 bg-yellow-600 text-white rounded-md mx-10"
            >
              Update Link
            </button>

            <button
              onClick={() => handleDeleteLink(link.id)}
              className="p-2 bg-red-600 text-white rounded-md"
            >
              Delete Link
            </button>
          </div>
        ))}
        <button
          onClick={handleNavigateToAddChapter}
          className="mb-6 p-2 bg-purple-600 text-white rounded-md"
        >
          Add New Chapter , Videos and Links
        </button>
      </div>

      <div className="flex justify-center p-23">
        <button
          onClick={() =>
            router.push(`${appUrl}/courses/${courseId}/chapters/${chapterId}`)
          }
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 my-7 px-6 rounded-lg transition"
        >
          Check Chapter
        </button>
      </div>
    </>
  );
}
