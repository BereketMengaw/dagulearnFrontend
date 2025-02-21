import { useState, useEffect, useCallback } from "react";

const useChapterAndVideo = (courseId) => {
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  // Fetch chapters for the given course
  const fetchChapters = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chapters/${courseId}/chapters/`
      );

      const data = await response.json();
      setChapters(Array.isArray(data) ? data : []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setChapters([]); // Prevent UI crashes
    } finally {
      setIsLoading(false);
    }
  }, [courseId]); // Add `courseId` as a dependency

  // Add a new chapter
  const addChapter = async (chapter) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors
    try {
      const requestBody = { ...chapter, courseId }; // Ensure courseId is included correctly
      console.log("Sending request to add chapter:", requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chapters/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      console.log("Response received:", response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add chapter");
      }

      await fetchChapters(); // Refresh chapter list
    } catch (error) {
      console.error("Error adding chapter:", error);
      setErrorMessage(
        "Error adding chapter: Make sure to use a different order or check your inputs."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new video
  const addVideo = async (video) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${courseId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(video),
        }
      );
      if (!response.ok) throw new Error("Failed to add video");

      alert("Video added successfully!");
    } catch (error) {
      console.error("Error adding video:", error);
      setErrorMessage("Error adding video: Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId, fetchChapters]); // Add `fetchChapters` as a dependency

  return {
    chapters,
    isLoading,
    errorMessage,
    fetchChapters,
    addChapter,
    addVideo,
  };
};

export default useChapterAndVideo;
