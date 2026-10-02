"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  PlayCircle,
  ExternalLink,
  FileText,
  Pencil,
  ListVideo,
  Video,
} from "lucide-react";
import {
  fetchCourseById,
  fetchChaptersByCourseId,
  fetchContentByChapterAndCourse,
  checkUserEnrollment,
} from "@/lib/fetcher";
import { courseHref } from "@/lib/format";
import Navbar from "@/components/Navbar/Navbar";
import AuthPopup from "@/app/auth/AuthPopup";

const extractVideoId = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/?|(?:watch\?v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { ID: courseId, chapterId } = params || {};
  const [isTrueCreator, setIsTrueCreator] = useState(false);
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [content, setContent] = useState({ title: "", videos: [], links: [], pdfs: [] });
  const [loading, setLoading] = useState(true);
  // { kind: "login" | "locked" | "empty", message }
  const [gate, setGate] = useState(null);

  useEffect(() => {
    if (!courseId || !chapterId) return;

    async function loadContent() {
      setLoading(true);
      setGate(null);
      setActiveVideo(0);

      try {
        const [courseData, chapterList] = await Promise.all([
          fetchCourseById(Number(courseId)),
          fetchChaptersByCourseId(Number(courseId)),
        ]);
        setCourse(courseData);
        setChapters([...chapterList].sort((a, b) => a.order - b.order));
        const creatorId = courseData.creatorId;

        const user = JSON.parse(localStorage.getItem("user"));
        const isFree = chapterId === "1";
        let access = false;

        if (user) {
          setIsTrueCreator(user.userId === creatorId);
          const enrollmentData = await checkUserEnrollment(user.userId, courseId);
          access =
            (enrollmentData?.enrolled || false) ||
            user.userId === creatorId ||
            user.role === "admin";
        }
        setHasAccess(access);

        if (!access && !isFree) {
          setGate(
            user
              ? { kind: "locked", message: "Buy this course to unlock this chapter." }
              : { kind: "login", message: "Log in and buy this course to watch this chapter." }
          );
          setLoading(false);
          return;
        }

        const contentData = await fetchContentByChapterAndCourse(
          Number(courseId),
          Number(chapterId)
        );

        setContent({
          title: contentData.title || "Untitled Chapter",
          videos: contentData.videos || [],
          links: contentData.links || [],
          pdfs: contentData.pdfs || [],
        });
      } catch (err) {
        setGate({ kind: "empty", message: "No content has been uploaded for this chapter yet." });
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [courseId, chapterId]);

  if (!courseId || !chapterId) {
    return <p className="mt-8 text-center font-semibold text-red-500">Invalid course ID or chapter order</p>;
  }

  const order = Number(chapterId);
  const current = chapters.find((c) => c.order === order);
  const idx = chapters.findIndex((c) => c.order === order);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const canOpen = (c) => hasAccess || c.order === 1;
  const go = (c) => router.push(`/courses/${courseId}/chapters/${c.order}`);

  const video = content.videos[activeVideo];
  const videoId = video && extractVideoId(video.url);

  const Sidebar = (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="eyebrow">Course content</p>
        {course && (
          <Link href={courseHref(course)} className="mt-1 block font-bold text-slate-900 hover:text-brand-700">
            {course.title?.trim()}
          </Link>
        )}
      </div>
      <ol className="max-h-[60vh] overflow-y-auto">
        {chapters.map((c, i) => {
          const active = c.order === order;
          const open = canOpen(c);
          return (
            <li key={c.id}>
              <button
                onClick={() => go(c)}
                className={`flex w-full items-start gap-3 px-5 py-3.5 text-left text-sm transition ${
                  active ? "bg-brand-50" : "hover:bg-slate-50"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`flex-1 ${active ? "font-semibold text-brand-800" : open ? "text-slate-800" : "text-slate-400"}`}>
                  {c.title}
                </span>
                {open ? (
                  <PlayCircle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                ) : (
                  <Lock size={15} className="mt-0.5 shrink-0 text-slate-300" />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );

  return (
    <>
      <Navbar setShowAuthPopup={setShowAuthPopup} />
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}

      <div className="min-h-screen bg-slate-50">
        <div className="container-page py-6 lg:py-8">
          {course && (
            <Link
              href={courseHref(course)}
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft size={16} /> Back to course
            </Link>
          )}

          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
            <main className="min-w-0 space-y-6">
              {loading ? (
                <div className="aspect-video w-full animate-pulse rounded-2xl bg-slate-200" />
              ) : gate ? (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-slate-950 p-6 text-center text-white">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                    {gate.kind === "empty" ? <Video size={26} /> : <Lock size={26} />}
                  </span>
                  <p className="mt-4 max-w-sm text-lg font-semibold">{gate.message}</p>
                  {gate.kind !== "empty" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {gate.kind === "login" && (
                        <button onClick={() => setShowAuthPopup(true)} className="btn-primary">
                          Log in
                        </button>
                      )}
                      {course && (
                        <Link
                          href={courseHref(course)}
                          className={gate.kind === "login" ? "inline-flex items-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10" : "btn-primary"}
                        >
                          View course &amp; price
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
                    {videoId ? (
                      <div className="relative aspect-video">
                        <iframe
                          key={videoId}
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-slate-400">
                        {content.videos.length ? "Unable to load video" : "No video for this chapter"}
                      </div>
                    )}
                  </div>

                  {content.videos.length > 1 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ListVideo size={16} /> {content.videos.length} videos in this chapter
                      </p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
                        {content.videos.map((v, i) => (
                          <button
                            key={v.id}
                            onClick={() => setActiveVideo(i)}
                            className={`shrink-0 rounded-xl border px-4 py-2 text-sm transition ${
                              i === activeVideo
                                ? "border-brand-500 bg-brand-50 font-semibold text-brand-800"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {i + 1}. {v.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-700">Chapter {idx >= 0 ? idx + 1 : order}</p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {current?.title || content.title}
                  </h1>
                  {video?.title && !gate && <p className="mt-1 text-slate-500">{video.title}</p>}
                </div>
                {isTrueCreator && (
                  <Link href={`/courses/${courseId}/chapters/${chapterId}/edit`} className="btn-secondary shrink-0">
                    <Pencil size={16} /> Edit chapter
                  </Link>
                )}
              </div>

              {/* Resources */}
              {!loading && !gate && (content.links.length > 0 || content.pdfs.length > 0) && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="font-bold text-slate-900">Resources</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {content.links.map((link) => (
                      <li key={link.id || link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-brand-50/50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                            <ExternalLink size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-900">
                              {link.title || "Untitled link"}
                            </span>
                            <span className="block truncate text-xs text-slate-500">{link.url}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                    {content.pdfs.map((pdf) => (
                      <li key={pdf.id || pdf.url}>
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-brand-50/50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <FileText size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-900">
                              {pdf.title || "Untitled PDF"}
                            </span>
                            <span className="block text-xs text-slate-500">Download PDF</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Prev / next */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
                {prev ? (
                  <button onClick={() => go(prev)} className="btn-secondary">
                    <ChevronLeft size={16} /> Previous
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button onClick={() => go(next)} className="btn-primary">
                    Next chapter <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </main>

            <div className="lg:sticky lg:top-24 lg:self-start">{Sidebar}</div>
          </div>
        </div>
      </div>
    </>
  );
}
