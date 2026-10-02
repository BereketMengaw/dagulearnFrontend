"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "../components/HomePage/Hero";
import Category from "@/components/HomePage/Category";
import { HowItWorks, TrustStrip, CreatorCTA, FAQ } from "@/components/HomePage/Sections";
import Navbar from "@/components/Navbar/Navbar";
import AuthPopup, { authTabHint } from "@/app/auth/AuthPopup";
import { fetchCategories, fetchCourses, fetchEnrollmentsCount } from "../lib/fetcher";

const HomeContent = () => {
  const router = useRouter();
  const query = useSearchParams().get("q") || "";

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetchCategories().then(setCategories).catch(() => setCategories([]));

    fetchCourses()
      .then(async (data) => {
        setCourses(data);
        setLoading(false);
        const counts = await Promise.all(
          data.map((c) => fetchEnrollmentsCount(c.id).then((r) => [c.id, r?.enrollmentCount || 0]))
        );
        setEnrollments(Object.fromEntries(counts));
      })
      .catch(() => {
        setError("We couldn't load courses right now. Please try again.");
        setLoading(false);
      });
  }, []);

  const openAuth = (tab = "login") => {
    authTabHint.next = tab;
    setShowAuthPopup(true);
  };

  const enrollmentValues = Object.values(enrollments);
  const stats = error
    ? { courses: "—", creators: "—", enrollments: "—" }
    : {
        courses: loading ? null : courses.length,
        creators: loading ? null : new Set(courses.map((c) => c.creatorId)).size,
        enrollments:
          loading || enrollmentValues.length < courses.length
            ? null
            : enrollmentValues.reduce((a, b) => a + b, 0),
      };

  return (
    <div className="w-full max-w-full">
      <Navbar setShowAuthPopup={setShowAuthPopup} />

      {showAuthPopup && (
        <AuthPopup setShowAuthPopup={setShowAuthPopup} onClose={() => setShowAuthPopup(false)} />
      )}

      <Hero user={user} stats={stats} onAuth={openAuth} />
      <TrustStrip />
      <Category
        courses={courses}
        categories={categories}
        enrollments={enrollments}
        loading={loading}
        error={error}
        query={query}
        onClearQuery={() => router.push("/#courses", { scroll: false })}
      />
      <HowItWorks />
      <CreatorCTA user={user} onAuth={openAuth} />
      <FAQ />
    </div>
  );
};

const HomePage = () => (
  <Suspense>
    <HomeContent />
  </Suspense>
);

export default HomePage;
