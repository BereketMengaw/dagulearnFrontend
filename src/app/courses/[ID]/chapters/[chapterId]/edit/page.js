"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Eye,
  Plus,
  Save,
  Trash2,
  Video,
  Link2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { fetchContentByChapterAndCourse } from "@/lib/fetcher";
import { apiUrl } from "@/lib/api";
import StudioShell, { Card, Field, StudioLoading } from "@/components/studio/StudioShell";

const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100";

export default function UpdateChapterPage() {
  const params = useParams();
  const { ID: courseId, chapterId } = params || {};
  const router = useRouter();

  const [content, setContent] = useState({
    title: "",
    videos: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }

  const [user, setUser] = useState(null);
  const [courseCreatorId, setCourseCreatorId] = useState(null);
  const [chapterOrder, setChapterOrder] = useState(null);

  const notify = (type, text) => {
    setStatus({ type, text });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!courseId || !chapterId) return;

    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        // Fetch course info
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`
        );
        if (!courseResponse.ok) throw new Error("Failed to fetch course info.");

        const courseData = await courseResponse.json();
        setCourseCreatorId(courseData.creatorId);

        // Get user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Check if user is the creator of the course or an admin
          if (
            parsedUser.userId !== courseData.creatorId &&
            parsedUser.role !== "admin"
          ) {
            router.push("/");
            return;
          }
        } else {
          router.push("/");
          return;
        }

        // Fetch chapter content
        const chapterResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chapters/${courseId}/chapters/${chapterId}`
        );
        if (!chapterResponse.ok)
          throw new Error("Failed to fetch chapter information.");

        const chapterData = await chapterResponse.json();
        setChapterOrder(chapterData.chapter.order); // Store the order

        const contentData = await fetchContentByChapterAndCourse(
          Number(courseId),
          Number(chapterId)
        );

        setContent({
          title: chapterData.chapter.title || "Untitled Chapter",
          videos: contentData.videos || [],
          links: contentData.links || [],
        });
      } catch (err) {
        setError("Failed to fetch content or course information.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [courseId, chapterId, router]);

  const handleDeleteVideo = async (videoId) => {
    try {
      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete video.");

      // Remove deleted video from state
      setContent((prevContent) => ({
        ...prevContent,
        videos: prevContent.videos.filter((video) => video.id !== videoId),
      }));
      notify("success", "Video deleted.");
    } catch (err) {
      notify("error", "Error deleting video.");
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const response = await fetch(`${apiUrl}/api/link/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete link.");

      // Remove deleted link from state
      setContent((prevContent) => ({
        ...prevContent,
        links: prevContent.links.filter((link) => link.id !== linkId),
      }));
      notify("success", "Link deleted.");
    } catch (err) {
      notify("error", "Error deleting link.");
    }
  };

  const handleUpdateChapter = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/chapters/${courseId}/chapters/order/${chapterId}.`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: content.title }),
        }
      );

      if (!response.ok) throw new Error("Failed to update chapter.");
      notify("success", "Chapter title updated.");
    } catch (err) {
      notify("error", "Error updating chapter.");
    }
  };

  const handleUpdateVideo = async (videoId, updatedTitle, updatedUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, url: updatedUrl }),
      });
      if (!response.ok) throw new Error("Failed to update video.");
      notify("success", "Video updated.");
    } catch (err) {
      notify("error", "Error updating video.");
    }
  };

  const handleUpdateLink = async (linkId, updatedTitle, updatedUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api/link/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, url: updatedUrl }),
      });

      if (!response.ok) throw new Error("Failed to update link.");
      notify("success", "Link updated.");
    } catch (err) {
      notify("error", "Error updating link.");
    }
  };

  const handleNavigateToAddChapter = () => {
    router.push(`/creator-dashboard/${courseId}/create-chapters`);
  };

  const updateVideoField = (id, field, value) =>
    setContent((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));

  const updateLinkField = (id, field, value) =>
    setContent((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));

  const actions = (
    <>
      <button onClick={handleNavigateToAddChapter} className="btn-secondary">
        <Plus size={16} /> Add chapters, videos &amp; links
      </button>
      <button
        onClick={() => router.push(`/courses/${courseId}/chapters/${chapterId}`)}
        className="btn-primary"
      >
        <Eye size={16} /> Check chapter
      </button>
    </>
  );

  if (loading) {
    return (
      <StudioShell title="Edit chapter">
        <StudioLoading />
      </StudioShell>
    );
  }

  if (error) {
    return (
      <StudioShell title="Edit chapter">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-700">
          {error}
        </div>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title={`Edit chapter ${chapterOrder ?? chapterId}`}
      subtitle="Update the title, videos and links learners see in this chapter."
      actions={actions}
    >
      {status && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Chapter title */}
        <Card>
          <h2 className="font-bold text-slate-900">Chapter title</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              aria-label="Chapter title"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="input flex-1"
            />
            <button onClick={handleUpdateChapter} className="btn-primary shrink-0">
              <Save size={16} /> Update chapter
            </button>
          </div>
        </Card>

        {/* Videos */}
        <Card>
          <div className="flex items-center gap-2">
            <Video size={18} className="text-brand-600" />
            <h2 className="font-bold text-slate-900">Videos</h2>
            <span className="text-sm text-slate-500">({content.videos.length})</span>
          </div>
          {content.videos.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No videos in this chapter yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {content.videos.map((video, i) => (
                <div key={video.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Video {i + 1}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Video title" htmlFor={`video-title-${video.id}`}>
                      <input
                        id={`video-title-${video.id}`}
                        type="text"
                        value={video.title}
                        onChange={(e) => updateVideoField(video.id, "title", e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="YouTube URL" htmlFor={`video-url-${video.id}`}>
                      <input
                        id={`video-url-${video.id}`}
                        type="text"
                        value={video.url}
                        onChange={(e) => updateVideoField(video.id, "url", e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateVideo(video.id, video.title, video.url)}
                      className="btn-primary py-2.5"
                    >
                      <Save size={16} /> Update video
                    </button>
                    <button onClick={() => handleDeleteVideo(video.id)} className={dangerBtn}>
                      <Trash2 size={16} /> Delete video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Links */}
        <Card>
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-brand-600" />
            <h2 className="font-bold text-slate-900">Links</h2>
            <span className="text-sm text-slate-500">({content.links.length})</span>
          </div>
          {content.links.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No links in this chapter yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {content.links.map((link, i) => (
                <div key={link.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Link {i + 1}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Link title" htmlFor={`link-title-${link.id}`}>
                      <input
                        id={`link-title-${link.id}`}
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLinkField(link.id, "title", e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="Link URL" htmlFor={`link-url-${link.id}`}>
                      <input
                        id={`link-url-${link.id}`}
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLinkField(link.id, "url", e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateLink(link.id, link.title, link.url)}
                      className="btn-primary py-2.5"
                    >
                      <Save size={16} /> Update link
                    </button>
                    <button onClick={() => handleDeleteLink(link.id)} className={dangerBtn}>
                      <Trash2 size={16} /> Delete link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </StudioShell>
  );
}
