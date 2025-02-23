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

  return (
    <div className="group w-64 sm:w-72 md:w-80 h-[360px] sm:h-[400px] bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Wrap entire card with Link to prevent nested <a> tags */}
      <Link href={`/${course.title}`} passHref>
        <div className="block flex-1 flex flex-col">
          {/* Thumbnail Section */}
          <div className="relative h-40 sm:h-48 w-full overflow-hidden">
            <Image
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              src={thumbnailUrl}
              alt={course.title || "Course thumbnail"}
              width={320} // Matches the largest card width (md:w-80)
              height={192} // Matches the largest image height (sm:h-48)
              priority // Optional: Prioritize loading for above-the-fold images
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
          <div className="p-4 flex-1 flex flex-col">
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
            <div className="mt-auto">
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
