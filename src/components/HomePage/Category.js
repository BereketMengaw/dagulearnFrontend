import React, { useState, useEffect, useMemo } from "react";
import { X, SearchX } from "lucide-react";
import CourseCard, { CourseCardSkeleton } from "./CourseCard";
import Page from "@/components/HomePage/Page";
import {
  FiBook,
  FiCode,
  FiMusic,
  FiCamera,
  FiDollarSign,
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
  FiFilm,
} from "react-icons/fi";

const categoryIcons = {
  All: FiLayers,
  Programming: FiCode,
  Design: FiMonitor,
  Business: FiBriefcase,
  Marketing: FiBarChart2,
  Photography: FiCamera,
  "Video Editing": FiFilm,
  Music: FiMusic,
  Finance: FiDollarSign,
  Health: FiHeart,
  Language: FiGlobe,
  "Personal Development": FiAward,
  Lifestyle: FiCoffee,
  Academics: FiBook,
  Security: FiShield,
  Other: FiSmile,
};

const SORTS = {
  popular: "Most popular",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

const coursesPerPage = 12;

const Category = ({ courses, categories, enrollments, loading, error, query, onClearQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sort, setSort] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [query, selectedCategory, sort]);

  // Only show categories that actually have courses, busiest first.
  const visibleCategories = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          count: courses.filter((course) => course.categoryId === c.id).length,
        }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count),
    [categories, courses]
  );

  const filteredCourses = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let list = courses.filter((course) => {
      if (selectedCategory && course.categoryId !== selectedCategory) return false;
      if (!q) return true;
      return [course.title, course.description, course.creator?.name, course.category?.name]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });

    const byPopularity = (a, b) => (enrollments[b.id] || 0) - (enrollments[a.id] || 0);
    const sorters = {
      popular: byPopularity,
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      "price-asc": (a, b) => Number(a.price) - Number(b.price),
      "price-desc": (a, b) => Number(b.price) - Number(a.price),
    };
    return [...list].sort(sorters[sort]);
  }, [courses, enrollments, selectedCategory, query, sort]);

  // "Bestseller" goes to the three most-enrolled courses overall, not to whatever sorts first.
  const topSellerIds = useMemo(
    () =>
      new Set(
        [...courses]
          .filter((c) => (enrollments[c.id] || 0) > 0)
          .sort((a, b) => (enrollments[b.id] || 0) - (enrollments[a.id] || 0))
          .slice(0, 3)
          .map((c) => c.id)
      ),
    [courses, enrollments]
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const chip = (active) =>
    `flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
      active
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    }`;

  const AllIcon = categoryIcons.All;

  return (
    <section id="courses" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Course catalog</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore courses
            </h2>
            <p className="mt-2 text-slate-600">
              Every course has a free first chapter. Preview it, then unlock the rest.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Categories */}
        <div className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 scrollbar-hidden">
          <button onClick={() => setSelectedCategory(null)} className={chip(selectedCategory === null)}>
            <AllIcon size={15} />
            All
            <span className="text-xs opacity-60">{courses.length}</span>
          </button>
          {visibleCategories.map((category) => {
            const Icon = categoryIcons[category.name] || categoryIcons.Other;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={chip(selectedCategory === category.id)}
              >
                <Icon size={15} />
                {category.name}
                <span className="text-xs opacity-60">{category.count}</span>
              </button>
            );
          })}
        </div>

        {query && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>
              {filteredCourses.length} result{filteredCourses.length === 1 ? "" : "s"} for{" "}
              <strong className="text-slate-900">&ldquo;{query}&rdquo;</strong>
            </span>
            <button
              onClick={onClearQuery}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              <X size={14} /> Clear search
            </button>
          </div>
        )}

        {/* Course grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading &&
            [...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
          {!loading &&
            paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrollmentCount={enrollments[course.id]}
                isTopSeller={topSellerIds.has(course.id)}
              />
            ))}
        </div>

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary mt-4">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <SearchX size={36} className="text-slate-400" />
            <p className="mt-3 font-semibold text-slate-900">No courses match that yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different word or browse all categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                onClearQuery();
              }}
              className="btn-secondary mt-5"
            >
              Show all courses
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Page currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
