"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  fetchCourseById,
  fetchContentByChapterAndCourse,
  checkUserEnrollment,
} from "@/lib/fetcher";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

const extractVideoId = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/?|(?:watch\?v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function ChapterPage() {
  const params = useParams();
  const { ID: courseId, chapterId } = params || {};
  const [isTrueCreator, setIsTrueCreator] = useState();

  const [content, setContent] = useState({
    title: "",
    videos: [],
    links: [],
    pdfs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId || !chapterId) return;

    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        const courseData = await fetchCourseById(Number(courseId));
        const creatorId = courseData.creatorId;
        const user = JSON.parse(localStorage.getItem("user"));

        setIsTrueCreator(user.userId === creatorId);

        if (!user) {
          setError("You need to log in to access this content.");
          setLoading(false);
          return;
        }

        if (chapterId !== "1") {
          const enrollmentData = await checkUserEnrollment(
            user.userId,
            courseId
          );
          const isEnrolled = enrollmentData?.enrolled || false;

          if (
            !isEnrolled &&
            user.userId !== creatorId &&
            user.role !== "admin"
          ) {
            setError("You do not have access to this course.");
            setLoading(false);
            return;
          }
        }

        const contentData = await fetchContentByChapterAndCourse(
          Number(courseId),
          Number(chapterId)
        );

        setContent({
          title: contentData.title || "Untitled Chapter",
          videos: contentData.videos || [],
          links: contentData.links || [],
          pdfs: contentData.pdfs || [],
        });
      } catch (err) {
        setError("NO CONTENT IS UPLOADED FOR THIS CHAPTER");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [courseId, chapterId]);

  console.log(isTrueCreator, "is the data of true creator");

  if (!courseId || !chapterId) {
    return (
      <p className="text-center text-red-500 font-semibold mt-8">
        Invalid course ID or chapter order
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-blue-500 font-semibold mt-8">
        Loading chapter details...
      </p>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className="text-center text-red-500 font-semibold mt-8">{error}</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg space-y-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {content.title}
        </h1>

        {/* Videos Section */}
        {content.videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.videos.map((video) => {
                const embedUrl = extractVideoId(video.url)
                  ? `https://www.youtube.com/embed/${extractVideoId(video.url)}`
                  : null;

                return (
                  <div
                    key={video.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      {video.title}
                    </h3>
                    {embedUrl ? (
                      <iframe
                        className="w-full h-56 rounded-lg"
                        src={embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p className="text-center text-red-500">
                        Unable to load video
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Links Section */}
        {Array.isArray(content.links) && content.links.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mt-6">Links</h2>
            {content.links.map((link) => (
              <div
                key={link.id || link.url}
                className="mb-4 p-4 border rounded-md bg-gray-50"
              >
                <label className="block text-md font-medium">Link Title:</label>
                <input
                  type="text"
                  value={link.title || "Untitled Link"}
                  className="border p-2 rounded w-full"
                  readOnly
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No links available</p>
        )}
      </div>
      {isTrueCreator ? (
        <button
          onClick={() =>
            (window.location.href = `http://localhost:3000/courses/${courseId}/chapters/${chapterId}/edit`)
          }
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Edit Page
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
