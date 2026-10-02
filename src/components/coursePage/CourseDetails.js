"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  Users,
  BookOpen,
  Infinity as InfinityIcon,
  FileText,
  Mail,
  MapPin,
  Briefcase,
  ChevronRight,
  Pencil,
  Loader2,
} from "lucide-react";
import { fetchEnrollmentsCount } from "@/lib/fetcher";
import { formatPrice } from "@/lib/format";

export default function CourseDetails({ course, chapters, setShowAuthPopup }) {
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [gmail, setgmail] = useState(null);
  const [creator, setCreator] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(null);

  const router = useRouter();

  const courseId = course?.id;
  const price = course?.price;
  const realCreat = course?.creatorId;

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Check if user is admin or creator
  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "admin");
      setIsCreator(user.userId === course.creatorId);
    }
  }, [user, course.creatorId]);

  useEffect(() => {
    if (!courseId) return;
    fetchEnrollmentsCount(courseId).then((d) => setEnrollmentCount(d?.enrollmentCount ?? 0));
  }, [courseId]);

  // Fetch creator profile
  useEffect(() => {
    if (!realCreat) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${realCreat}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.creator && setCreator(data.creator))
      .catch((error) => console.error("Error checking creator:", error));
  }, [realCreat]);

  // Fetch creator's basic info
  useEffect(() => {
    if (!creator?.userId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${realCreat}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch creator information");
        return r.json();
      })
      .then((data) => {
        setgmail(data.data.gmail);
        setName(data.data.name);
      })
      .catch((err) => console.error(err));
  }, [creator?.userId, realCreat]);

  // Check if user is enrolled in the course
  useEffect(() => {
    if (!user || !courseId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/check/${user.userId}/${courseId}`)
      .then((r) => r.json())
      .then((data) => setIsEnrolled(data.enrolled))
      .catch(() => setIsEnrolled(false));
  }, [courseId, user]);

  const hasAccess = isAdmin || isCreator || isEnrolled;

  // Handle Buy Now button click
  const handleBuy = async () => {
    setErrorMessage("");
    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    const { name, phoneNumber, userId, gmail } = user;
    const [firstName, lastName] = name ? name.split(" ") : ["", ""];
    const transactionReference = `tx_${Date.now()}`;

    try {
      setLoading(true);

      const paymentData = {
        userId,
        courseId,
        amount: price,
        email: gmail,
        firstName,
        lastName,
        phoneNumber,
        txRef: transactionReference,
        callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/payments/callback`,
        // Chapa sends the learner back to this course page after paying.
        returnUrl: window.location.href,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setErrorMessage("We couldn't start the payment. Please try again.");
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorMessage("Something went wrong while contacting Chapa. Please try again.");
    }
    setLoading(false);
  };

  const canOpen = (chapter) => hasAccess || chapter.order === 1;

  const handleChapterClick = (chapter) => {
    if (canOpen(chapter)) {
      router.push(`/courses/${courseId}/chapters/${chapter.order}`);
    } else {
      setErrorMessage("Buy this course to unlock every chapter.");
      document.getElementById("purchase")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
  const firstChapter = sortedChapters.find((c) => c.order === 1);
  const thumbnailUrl = course?.thumbnail || "/images/Thumbnail.jpg";
  const creatorName = name || course.creator?.name || "DaguLearn creator";
  const skills = creator?.skills?.split(",").map((s) => s.trim()).filter(Boolean) || [];

  const goToChapter = (order) => router.push(`/courses/${courseId}/chapters/${order}`);

  const PurchaseCard = () => (
    <div
      id="purchase"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
    >
      <div className="relative aspect-video bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={course.title || "Course thumbnail"} className="h-full w-full object-cover" />
        {firstChapter && !hasAccess && (
          <button
            onClick={() => goToChapter(1)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/40 text-white transition hover:bg-slate-950/50"
          >
            <PlayCircle size={52} />
            <span className="text-sm font-semibold">Preview chapter 1 free</span>
          </button>
        )}
      </div>

      <div className="p-6">
        {hasAccess ? (
          <>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={20} />
              <p className="font-bold">
                {isEnrolled ? "You own this course" : isCreator ? "This is your course" : "Admin access"}
              </p>
            </div>
            <button
              onClick={() => goToChapter(firstChapter?.order || 1)}
              disabled={!sortedChapters.length}
              className="btn-primary mt-5 w-full py-3.5 text-base"
            >
              <PlayCircle size={18} /> Start learning
            </button>
          </>
        ) : (
          <>
            <p className="text-3xl font-extrabold text-slate-900">{formatPrice(price)}</p>
            <p className="mt-1 text-sm text-slate-500">One-time payment · Lifetime access</p>
            <button
              onClick={handleBuy}
              disabled={loading}
              className="btn-primary mt-5 w-full py-3.5 text-base"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Redirecting to Chapa…
                </>
              ) : user ? (
                "Buy now"
              ) : (
                "Log in to buy"
              )}
            </button>
            {firstChapter && (
              <button onClick={() => goToChapter(1)} className="btn-secondary mt-3 w-full">
                Preview chapter 1
              </button>
            )}
          </>
        )}

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        )}

        <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-700">
          <li className="flex items-center gap-3">
            <BookOpen size={17} className="text-slate-400" />
            {sortedChapters.length} chapter{sortedChapters.length === 1 ? "" : "s"}
          </li>
          <li className="flex items-center gap-3">
            <FileText size={17} className="text-slate-400" /> Videos, links and PDFs
          </li>
          <li className="flex items-center gap-3">
            <InfinityIcon size={17} className="text-slate-400" /> Learn at your own pace
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheck size={17} className="text-emerald-500" /> Secure payment by Chapa
          </li>
        </ul>

        {(isAdmin || isCreator) && (
          <button
            onClick={() => router.push(`/courses/${courseId}/edit`)}
            className="btn-secondary mt-5 w-full"
          >
            <Pencil size={16} /> Update course
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header band */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="container-page relative grid gap-10 py-10 lg:grid-cols-[1fr_380px] lg:py-14">
          <div className="lg:pr-8">
            <nav className="flex items-center gap-1.5 text-sm text-slate-400">
              <Link href="/#courses" className="hover:text-white">
                Courses
              </Link>
              <ChevronRight size={14} />
              <span className="text-brand-300">{course.category?.name || "General"}</span>
            </nav>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {course.title?.trim()}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                {creator?.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={creator.profilePicture} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold">
                    {creatorName[0]}
                  </span>
                )}
                Created by <a href="#instructor" className="font-semibold text-white underline-offset-4 hover:underline">{creatorName}</a>
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {enrollmentCount ?? "–"} enrolled
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} />
                {sortedChapters.length} chapters
              </span>
            </div>
          </div>

          {/* Mobile: card sits under the header. Desktop: it floats in the sidebar below. */}
          <div className="lg:hidden">
            <PurchaseCard />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_380px] lg:py-14">
        <div className="space-y-12 lg:pr-8">
          {/* Curriculum */}
          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Course content</h2>
              <p className="text-sm text-slate-500">
                {sortedChapters.length} chapter{sortedChapters.length === 1 ? "" : "s"}
              </p>
            </div>

            {sortedChapters.length > 0 ? (
              <ol className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
                {sortedChapters.map((chapter, index) => {
                  const open = canOpen(chapter);
                  return (
                    <li key={chapter.id}>
                      <button
                        onClick={() => handleChapterClick(chapter)}
                        className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
                          open ? "hover:bg-brand-50/60" : "hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            open ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className={`flex-1 font-medium ${open ? "text-slate-900" : "text-slate-500"}`}>
                          {chapter.title}
                        </span>
                        {open ? (
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                            {!hasAccess && chapter.order === 1 && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                                Free
                              </span>
                            )}
                            <PlayCircle size={18} />
                          </span>
                        ) : (
                          <Lock size={17} className="text-slate-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                The creator hasn&apos;t added chapters yet.
              </p>
            )}
          </section>

          {/* Instructor */}
          <section id="instructor" className="scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Your instructor</h2>
            <div className="mt-5 rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                {creator?.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creator.profilePicture}
                    alt={creatorName}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                    {creatorName[0]}
                  </span>
                )}
                <div>
                  <p className="text-lg font-bold text-slate-900">{creatorName}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    {creator?.experience && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} /> {creator.experience} yrs experience
                      </span>
                    )}
                    {creator?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {creator.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {creator?.bio && <p className="mt-5 leading-relaxed text-slate-700">{creator.bio}</p>}

              {skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {gmail && (
                <a
                  href={`mailto:${gmail}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                >
                  <Mail size={16} /> {gmail}
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Desktop sticky purchase card, pulled up to overlap the header band */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 -mt-[320px]">
            <PurchaseCard />
          </div>
        </aside>
      </div>

      {/* Mobile sticky buy bar */}
      {!hasAccess && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
          <div className="container-page flex items-center justify-between gap-4">
            <p className="text-xl font-extrabold text-slate-900">{formatPrice(price)}</p>
            <button onClick={handleBuy} disabled={loading} className="btn-primary flex-1 sm:flex-none">
              {loading ? "Redirecting…" : user ? "Buy now" : "Log in to buy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
