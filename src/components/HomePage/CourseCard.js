import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEnrollmentsCount } from "../../lib/api";
import Image from "next/image";

const CourseCard = ({ course, isTopSeller }) => {
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true); // Adding loading state

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (!course?.id) return; // Ensure course ID exists before fetching

        const data = await fetchEnrollmentsCount(course.id);
        setEnrollmentCount(data?.enrollmentCount ?? 0); // Safely set the count
      } catch (error) {
        console.error("Failed to fetch enrollment count:", error); // Log error silently
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchCount();
  }, [course?.id]);

  const thumbnailUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : "/placeholder-thumbnail.jpg"; // Placeholder for no image

  console.log(`${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`);

  return (
    <div className="group relative max-w-xs mx-auto bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Wrap entire card with Link to prevent nested <a> tags */}
      <Link href={`/${course.title}`} passHref>
        <div className="block">
          {/* Thumbnail Section */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <Image
              className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              src={thumbnailUrl}
              alt={course.title || "Course thumbnail"}
            />
            {/* Top Seller Badge */}
            {isTopSeller && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs px-3 py-1 rounded-full">
                Top Seller
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {course.description}
            </p>

            {/* Metadata */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
              <span className="italic">
                {course.creator?.name || "Unknown"}
              </span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {course.category?.name || "General"}
              </span>
            </div>

            {/* Price and Enrollment Count */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-600 font-bold text-sm">
                {course.price ? `${course.price} ETB` : "Free"}
              </span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {loading ? "Loading..." : `${enrollmentCount} Enrolled`}
              </span>
            </div>

            {/* Go to Course Button */}
            <div className="flex justify-center">
              <button
                onClick={(e) => e.stopPropagation()} // Prevent link navigation on button click
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors duration-300"
              >
                Go to Course
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
