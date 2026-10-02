"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useChapterAndVideo from "@/hooks/useChapterAndVideo";
import { addLink } from "@/hooks/linkAdder"; // Import the fetcher function
import Link from "next/link";
import { BookPlus, Video, Link2, Pencil, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import StudioShell, { Card, Field } from "@/components/studio/StudioShell";
import CourseSteps from "@/components/studio/CourseSteps";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ChapterAndVideoForm = () => {
  const { courseId } = useParams(); // Extract courseId from URL
  const { chapters, isLoading, addChapter, addVideo } =
    useChapterAndVideo(courseId);
  const [newChapter, setNewChapter] = useState({ title: "", order: "" });
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    chapterId: "",
  });
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    chapterId: "",
    order: "",
  });
  const [courseCreatorId, setCourseCreatorId] = useState(null);
  const [user, setUser] = useState(null);
  // Inline feedback replacing the old alert() popups: { type: "error" | "success", text }
  const [notice, setNotice] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseInfo = async () => {
      if (!user) return; // Stop if user is not available

      try {
        const response = await fetch(`${apiUrl}/api/courses/${courseId}`);
        const courseData = await response.json();
        setCourseCreatorId(courseData.creatorId);

        // Check if the user is the creator or admin
        if (courseData.creatorId !== user?.userId && user?.role !== "admin") {
          router.push("/"); // Redirect to home if not authorized
        }
      } catch (error) {
        console.error("Failed to fetch course info:", error);
      }
    };

    if (courseId) {
      fetchCourseInfo();
    }
  }, [courseId, user, router]);

  const handleChapterSelection = (e, type) => {
    const selectedChapterId = e.target.value;
    const selectedChapter = chapters.find(
      (chapter) => chapter.id === parseInt(selectedChapterId)
    );

    if (selectedChapter) {
      if (type === "video") {
        setNewVideo({
          ...newVideo,
          chapterId: selectedChapterId,
          order: selectedChapter.order, // Sync order with chapter
        });
      } else if (type === "link") {
        setNewLink({
          ...newLink,
          chapterId: selectedChapterId,
          order: selectedChapter.order, // Sync order with chapter
        });
      }
    }
  };

  const handleChapterSubmit = async () => {
    if (!newChapter.title.trim() || !newChapter.order) {
      setNotice({ type: "error", text: "Chapter title and order are required." });
      return;
    }
    setNotice(null);
    await addChapter(newChapter);
    setNewChapter({ title: "", order: "" });
  };

  const handleVideoSubmit = async () => {
    if (!newVideo.chapterId || !newVideo.title.trim() || !newVideo.url.trim()) {
      setNotice({ type: "error", text: "Choose a chapter and fill in the video title and URL." });
      return;
    }

    await addVideo({
      title: newVideo.title,
      url: newVideo.url,
      chapterId: newVideo.chapterId,
      order: newVideo.order, // Ensuring the order matches the selected chapter
    });

    setNewVideo({ title: "", url: "", chapterId: "", order: "" });
    setNotice({ type: "success", text: "Video added." });
  };

  const handleLinkSubmit = async () => {
    if (
      !newLink.chapterId ||
      !newLink.title.trim() ||
      !newLink.url.trim() ||
      !newLink.order
    ) {
      setNotice({ type: "error", text: "Choose a chapter and fill in the link title and URL." });
      return;
    }

    try {
      await addLink({
        title: newLink.title,
        url: newLink.url,
        chapterId: parseInt(newLink.chapterId),
        order: parseInt(newLink.order),
      });

      setNotice({ type: "success", text: "Link uploaded successfully." });
      setNewLink({ title: "", url: "", chapterId: "", order: "" });
    } catch (error) {
      setNotice({ type: "error", text: "Failed to upload link. Please try again." });
    }
  };

  const handleButtonClick = () => {
    // Redirect to the dynamic course update page
    router.push(`/courses/${courseId}/edit`);
  };

  const chapterOptions = (
    <>
      <option value="">Select chapter</option>
      {chapters.length > 0 ? (
        chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.order}. {chapter.title}
          </option>
        ))
      ) : (
        <option value="" disabled>
          No chapters available
        </option>
      )}
    </>
  );

  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const SectionTitle = ({ icon: Icon, title, hint }) => (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={18} />
      </span>
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{hint}</p>
      </div>
    </div>
  );

  return (
    <StudioShell
      title="Chapters & videos"
      subtitle="Build the course outline, then attach YouTube videos and resource links to each chapter."
      actions={
        <Link
          href={`/courses/${courseId}/edit`}
          className={`btn-primary ${chapters.length === 0 ? "pointer-events-none opacity-60" : ""}`}
          aria-disabled={isLoading || chapters.length === 0}
        >
          Review course <ArrowRight size={16} />
        </Link>
      }
    >
      <CourseSteps current={3} />

      {notice && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            notice.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {notice.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {notice.text}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Add Chapter */}
          <Card>
            <SectionTitle icon={BookPlus} title="Add a chapter" hint="Chapter 1 is the free preview for every learner." />
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <Field label="Chapter title" htmlFor="chapter-title">
                <input
                  id="chapter-title"
                  type="text"
                  placeholder="e.g. Introduction to Full-Stack Development"
                  className="input"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                />
              </Field>
              <Field label="Order" htmlFor="chapter-order">
                <input
                  id="chapter-order"
                  type="number"
                  placeholder="1"
                  className="input"
                  value={newChapter.order}
                  onChange={(e) => setNewChapter({ ...newChapter, order: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <button type="button" className="btn-primary" onClick={handleChapterSubmit} disabled={isLoading}>
                {isLoading ? "Adding…" : "Add chapter"}
              </button>
            </div>
          </Card>

          {/* Add Video */}
          <Card>
            <SectionTitle icon={Video} title="Add a video" hint="Paste a YouTube link. It plays inside DaguLearn." />
            <div className="space-y-4">
              <Field label="Chapter" htmlFor="video-chapter">
                <select
                  id="video-chapter"
                  className="input"
                  value={newVideo.chapterId}
                  onChange={(e) => handleChapterSelection(e, "video")}
                >
                  {chapterOptions}
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Video title" htmlFor="video-title">
                  <input
                    id="video-title"
                    type="text"
                    placeholder="e.g. Setting up your tools"
                    className="input"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  />
                </Field>
                <Field label="YouTube URL" htmlFor="video-url">
                  <input
                    id="video-url"
                    type="url"
                    placeholder="https://youtu.be/…"
                    className="input"
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={handleVideoSubmit}
                disabled={isLoading || chapters.length === 0}
              >
                {isLoading ? "Uploading…" : "Add video"}
              </button>
            </div>
          </Card>

          {/* Add Link */}
          <Card>
            <SectionTitle icon={Link2} title="Add a resource link" hint="Slides, docs, repos or anything learners should open." />
            <div className="space-y-4">
              <Field label="Chapter" htmlFor="link-chapter">
                <select
                  id="link-chapter"
                  className="input"
                  value={newLink.chapterId}
                  onChange={(e) => handleChapterSelection(e, "link")}
                >
                  {chapterOptions}
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Link title" htmlFor="link-title">
                  <input
                    id="link-title"
                    type="text"
                    placeholder="e.g. Course slides"
                    className="input"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                </Field>
                <Field label="URL" htmlFor="link-url">
                  <input
                    id="link-url"
                    type="url"
                    placeholder="https://…"
                    className="input"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleLinkSubmit}
                disabled={isLoading || chapters.length === 0}
              >
                {isLoading ? "Uploading…" : "Add link"}
              </button>
            </div>
          </Card>
        </div>

        {/* Existing chapters */}
        <Card className="h-fit p-0 xl:sticky xl:top-24">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="eyebrow">Course outline</p>
            <p className="mt-1 text-sm text-slate-500">
              {chapters.length} chapter{chapters.length === 1 ? "" : "s"}
            </p>
          </div>
          {sorted.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No chapters added for this course yet.</p>
          ) : (
            <ol className="divide-y divide-slate-100">
              {sorted.map((chapter) => (
                <li key={chapter.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {chapter.order}
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-800">{chapter.title}</span>
                  <Link
                    href={`/courses/${courseId}/chapters/${chapter.order}/edit`}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </StudioShell>
  );
};

export default ChapterAndVideoForm;
