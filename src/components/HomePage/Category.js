import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import {
  fetchCategories,
  fetchCourses,
  fetchEnrollmentsCount,
} from "../../lib/fetcher";
import Page from "@/components/HomePage/Page";
import {
  FiBook,
  FiCode,
  FiMusic,
  FiCamera,
  FiDollarSign,
  FiPieChart,
  FiGlobe,
  FiHeart,
  FiLayers,
  FiMonitor,
  FiBarChart2,
  FiSmile,
  FiShield,
  FiAward,
  FiBriefcase,
  FiCoffee,
} from "react-icons/fi";

// Color palette for categories
const categoryColors = {
  All: "from-purple-400 to-purple-600",
  Programming: "from-blue-400 to-blue-600",
  Design: "from-pink-400 to-pink-600",
  Business: "from-indigo-400 to-indigo-600",
  Marketing: "from-green-400 to-green-600",
  Photography: "from-red-400 to-red-600",
  Music: "from-yellow-400 to-yellow-600",
  Finance: "from-emerald-400 to-emerald-600",
  Health: "from-rose-400 to-rose-600",
  Language: "from-cyan-400 to-cyan-600",
  "Personal Development": "from-violet-400 to-violet-600",
  Lifestyle: "from-amber-400 to-amber-600",
  Academics: "from-sky-400 to-sky-600",
  Security: "from-orange-400 to-orange-600",
  Other: "from-lime-400 to-lime-600",
};

// Map categories to icons with white color
const categoryIcons = {
  All: <FiLayers className="text-sm md:text-xl text-white" />,
  Programming: <FiCode className="text-sm md:text-xl text-white" />,
  Design: <FiMonitor className="text-sm md:text-xl text-white" />,
  Business: <FiBriefcase className="text-sm md:text-xl text-white" />,
  Marketing: <FiBarChart2 className="text-sm md:text-xl text-white" />,
  Photography: <FiCamera className="text-sm md:text-xl text-white" />,
  Music: <FiMusic className="text-sm md:text-xl text-white" />,
  Finance: <FiDollarSign className="text-sm md:text-xl text-white" />,
  Health: <FiHeart className="text-sm md:text-xl text-white" />,
  Language: <FiGlobe className="text-sm md:text-xl text-white" />,
  "Personal Development": <FiAward className="text-sm md:text-xl text-white" />,
  Lifestyle: <FiCoffee className="text-sm md:text-xl text-white" />,
  Academics: <FiBook className="text-sm md:text-xl text-white" />,
  Security: <FiShield className="text-sm md:text-xl text-white" />,
  Other: <FiSmile className="text-sm md:text-xl text-white" />,
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [courseEnrollments, setCourseEnrollments] = useState({});

  const coursesPerPage = 12;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    loadCategories();
    loadCourses();
  }, []);

  useEffect(() => {
    const loadEnrollmentCounts = async () => {
      try {
        const newCourseEnrollments = {};
        for (let course of courses) {
          const { enrollmentCount } = await fetchEnrollmentsCount(course.id);
          newCourseEnrollments[course.id] = enrollmentCount || 0;
        }
        setCourseEnrollments(newCourseEnrollments);
      } catch (error) {
        console.error("Error loading enrollment counts:", error);
      }
    };

    if (courses.length > 0) {
      loadEnrollmentCounts();
    }
  }, [courses]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.categoryId === selectedCategory)
    : courses;

  const sortedCourses = filteredCourses.sort(
    (a, b) => (courseEnrollments[b.id] || 0) - (courseEnrollments[a.id] || 0)
  );

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <div className="container mx-auto pb-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-   text-gray-900 mb-3 py-2 caveat">
        Explore Top Categories
      </h1>

      {/* Colorful Scrollable Categories */}
      <div className="flex items-center justify-center mb-8 md:mb-12">
        <div
          id="categoryScroll"
          className="flex overflow-x-auto scrollbar-hidden mx-2 space-x-3 md:space-x-4 scrollbar-hide snap-x snap-mandatory py-2 md:py-4"
        >
          <button
            onClick={() => handleCategorySelect(null)}
            className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[120px] h-20 md:h-32 px-2 md:px-4 rounded-lg md:rounded-xl shadow-md transition-all transform hover:scale-105 ${
              selectedCategory === null
                ? "bg-gradient-to-br from-purple-500 to-purple-700"
                : "bg-gradient-to-br from-purple-300 to-purple-400"
            }`}
          >
            <div
              className={`p-2 md:p-3 rounded-full mb-1 md:mb-2 bg-white bg-opacity-20`}
            >
              {categoryIcons["All"]}
            </div>
            <span className="text-xs md:text-sm font-medium text-white">
              All
            </span>
            <span className="text-[10px] md:text-xs mt-0.5 md:mt-1 text-white text-opacity-80">
              {courses.length} courses
            </span>
          </button>

          {categories.map((category) => {
            const colorClass =
              categoryColors[category.name] || categoryColors["Other"];
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[120px] h-20 md:h-32 px-2 md:px-4 rounded-lg md:rounded-xl shadow-md transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-br ${colorClass} border-2 border-black`
                    : `bg-gradient-to-br ${colorClass}`
                }`}
              >
                <div
                  className={`p-2 md:p-3 rounded-full mb-1 md:mb-2 bg-white bg-opacity-20`}
                >
                  {categoryIcons[category.name] || categoryIcons["Other"]}
                </div>
                <span className="text-xs md:text-sm font-medium text-white">
                  {category.name}
                </span>
                <span className="text-[10px] md:text-xs mt-0.5 md:mt-1 text-white text-opacity-80">
                  {courses.filter((c) => c.categoryId === category.id).length}{" "}
                  courses
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 my-4 md:my-6 ">
        {paginatedCourses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            isTopSeller={index < 3 && currentPage === 1}
          />
        ))}
      </div>

      {/* Pagination */}
      <Page
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Category;
