"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  fetchCourseById,
  fetchContentByChapterAndCourse,
  checkUserEnrollment,
} from "@/lib/fetcher";
import Navbar from "@/components/Navbar/Navbar";
import { appUrl } from "@/app/creator-dashboard/register/page";

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
  const [selectedVideo, setSelectedVideo] = useState(null); // Track selected video for modal
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

  if (!courseId || !chapterId) {
    return (
      <p className="text-center text-red-500 font-semibold mt-8">
        Invalid course ID or chapter order
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-center text-red-500 font-semibold">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg space-y-8 mt-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          {content.title}
        </h1>

        {/* Videos Section */}
        {content.videos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Videos</h2>
            <div className="flex justify-center">
              <div className="w-full lg:w-3/4 xl:w-2/3 h-screen">
                {content.videos.map((video) => {
                  const embedUrl = extractVideoId(video.url)
                    ? `https://www.youtube.com/embed/${extractVideoId(
                        video.url
                      )}`
                    : null;

                  return (
                    <div
                      key={video.id}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedVideo(video)} // Open modal on click
                    >
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        {video.title}
                      </h3>
                      {embedUrl ? (
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            className="w-full h-full rounded-lg"
                            src={embedUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
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
          </div>
        )}

        {/* Links Section */}
        {Array.isArray(content.links) && content.links.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.links.map((link) => (
                <div
                  key={link.id || link.url}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {link.title || "Untitled Link"}
                  </h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-words"
                  >
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No links available</p>
        )}

        {/* PDFs Section */}
        {Array.isArray(content.pdfs) && content.pdfs.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">PDFs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.pdfs.map((pdf) => (
                <div
                  key={pdf.id || pdf.url}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {pdf.title || "Untitled PDF"}
                  </h3>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-words"
                  >
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No PDFs available</p>
        )}

        {/* Edit Button for Creator */}
        {isTrueCreator && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                (window.location.href = `${appUrl}/courses/${courseId}/chapters/${chapterId}/edit`)
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Go to Edit Page
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedVideo.title}
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${extractVideoId(
                  selectedVideo.url
                )}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={() => setSelectedVideo(null)} // Close modal
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
