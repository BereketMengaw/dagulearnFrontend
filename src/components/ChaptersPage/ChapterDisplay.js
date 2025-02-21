import React, { useState, useEffect, useCallback } from "react";

const ChapterDisplay = ({ courseId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters`
      );
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]); // Add `courseId` as a dependency

  useEffect(() => {
    if (courseId) {
      fetchChapters();
    }
  }, [courseId, fetchChapters]); // Include `fetchChapters` in the dependency array

  if (loading) {
    return <p className="text-center">Loading chapters...</p>;
  }

  if (!chapters.length) {
    return <p className="text-center text-gray-500">No chapters available.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Chapters</h2>
      <ul className="list-disc pl-6">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="mt-2">
            {chapter.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterDisplay;
