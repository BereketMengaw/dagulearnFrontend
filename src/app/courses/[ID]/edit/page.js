"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import StudioShell, { Card, Field } from "@/components/studio/StudioShell";
import { courseHref } from "@/lib/format";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditCoursePage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState({
    price: "",
    title: "",
    description: "",
    thumbnail: "",
    creatorId: "", // Store course creator ID
  });
  const [chapters, setChapters] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }

  const Id = pathname?.split("/")[2]; // Extract courseId from the URL

  // Fetch user information
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch course and chapters details
  useEffect(() => {
    if (!Id || !user) return; // Don't fetch until both are ready

    const fetchCourse = async () => {
      const res = await fetch(`${apiUrl}/api/courses/${Id}`);
      const data = await res.json();
      setCourse({
        ...data,
        thumbnail: `${data.thumbnail}`,
        creatorId: data.creatorId, // Set course creator ID
      });
    };

    const fetchChapters = async () => {
      const res = await fetch(`${apiUrl}/api/chapters/${Id}/chapters/`);
      const data = await res.json();
      setChapters(data);
    };

    fetchCourse();
    fetchChapters();
  }, [Id, user]); // Depend on both Id and user to re-fetch when they change

  // Redirect when both course and user data is available
  useEffect(() => {
    if (user && course.creatorId) {
      if (user.role !== "admin" && user.userId !== course.creatorId) {
        router.push("/"); // Redirect to homepage if unauthorized
      }
    }
  }, [user, course.creatorId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      let uploadedImageUrl = course.thumbnail;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("thumbnail", selectedImage);

        const uploadRes = await fetch(`${apiUrl}/api/courses/${Id}/thumbnail`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = `${process.env.NEXT_PUBLIC_API_URL}${uploadData.thumbnailUrl}`;
        }
      }

      const updatedData = {
        price: course.price,
        title: course.title,
        description: course.description,
        thumbnail: uploadedImageUrl,
      };

      const res = await fetch(`${apiUrl}/api/courses/${Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setStatus({ type: "success", text: "Course updated successfully." });
        router.refresh();
      } else {
        const error = await res.json();
        setStatus({ type: "error", text: error.message || "Could not update the course." });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    const res = await fetch(`${apiUrl}/api/courses/${Id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/");
    } else {
      const error = await res.json();
      setStatus({ type: "error", text: error.message || "Could not delete the course." });
    }
  };

  const canEdit =
    user && (user.role === "admin" || user.userId === course.creatorId);
  const canDelete = user && user.role === "admin";
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
  const previewSrc = imagePreview || (course.thumbnail && course.thumbnail !== "undefined" ? course.thumbnail : "");

  return (
    <StudioShell
      title="Edit course"
      subtitle={course.title ? course.title.trim() : "Update details, price and thumbnail"}
      actions={
        course.title && (
          <button
            type="button"
            onClick={() => router.push(courseHref(course))}
            className="btn-secondary"
          >
            <Eye size={16} /> Check course
          </button>
        )
      }
    >
      {status && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left: details */}
        <Card className="space-y-5">
          <h2 className="font-bold text-slate-900">Course details</h2>
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="input"
            />
          </Field>
          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
              className="input"
              rows="6"
            />
          </Field>
          <Field label="Price (ETB)" htmlFor="price" hint="Learners pay this once to unlock every chapter.">
            <input
              id="price"
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="input"
            />
          </Field>

          {(canEdit || canDelete) && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              {canEdit && (
                <button type="submit" disabled={saving} className="btn-primary">
                  <Save size={16} /> {saving ? "Saving…" : "Update course"}
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 size={16} /> Delete course
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Right: thumbnail + chapters */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-bold text-slate-900">Thumbnail</h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-slate-100">
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt="Thumbnail"
                  className="aspect-video w-full object-cover"
                  width={640}
                  height={360}
                  unoptimized
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-slate-400">
                  <ImagePlus size={28} />
                </div>
              )}
            </div>
            <label className="btn-secondary mt-4 w-full cursor-pointer">
              <ImagePlus size={16} />
              {selectedImage ? selectedImage.name : "Choose new image"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
            <p className="mt-2 text-xs text-slate-500">The new image is saved when you click Update course.</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Chapters</h2>
              <Link
                href={`/creator-dashboard/${Id}/create-chapters`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
              >
                <Plus size={15} /> Add
              </Link>
            </div>
            {sortedChapters.length > 0 ? (
              <ol className="mt-4 divide-y divide-slate-100">
                {sortedChapters.map((chapter, i) => (
                  <li key={chapter.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{chapter.title}</p>
                      <p className="text-xs text-slate-500">Order {chapter.order}</p>
                    </div>
                    <Link
                      href={`/courses/${Id}/chapters/${chapter.order}/edit`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-sm text-slate-500">No chapters available for this course.</p>
                <Link href={`/creator-dashboard/${Id}/create-chapters`} className="btn-primary mt-4">
                  <Plus size={16} /> Add chapter
                </Link>
              </div>
            )}
          </Card>
        </div>
      </form>
    </StudioShell>
  );
}
