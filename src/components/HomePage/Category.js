import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import {
  fetchCategories,
  fetchCourses,
  fetchEnrollmentsCount,
} from "../../lib/fetcher";

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
      } catch (error) {}
    };

    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {}
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
      } catch (error) {}
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
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 caveat ">
        Explore Top Categories
      </h1>

      {/* Scrollable Categories */}
      <div className="flex items-center justify-center mb-8">
        <button
          onClick={() =>
            document
              .getElementById("categoryScroll")
              .scrollBy({ left: -150, behavior: "smooth" })
          }
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 shadow-md"
        >
          &lt;
        </button>

        <div
          id="categoryScroll"
          className="flex overflow-x-auto mx-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-lg caveat  font-semibold px-6 py-3 border rounded-full shadow-md transition mx-2 ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-lg caveat  font-semibold px-6 py-3 border rounded-full shadow-md transition mx-2 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            document
              .getElementById("categoryScroll")
              .scrollBy({ left: 150, behavior: "smooth" })
          }
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 shadow-md"
        >
          &gt;
        </button>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {paginatedCourses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            isTopSeller={index < 3 && currentPage === 1}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 rounded-md bg-gray-200"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded-md bg-gray-200"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Category;
