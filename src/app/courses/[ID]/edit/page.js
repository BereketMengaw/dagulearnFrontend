"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
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
        thumbnail: `${process.env.NEXT_PUBLIC_API_URL}${data.thumbnail}`,
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
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert("Course updated successfully!");
      router.refresh();
    } else {
      const error = await res.json();
      alert(error.message);
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
      alert("Course deleted successfully!");
      router.push("/");
    } else {
      const error = await res.json();
      alert(error.message);
    }
  };

  const canEdit =
    user && (user.role === "admin" || user.userId === course.creatorId);
  const canDelete = user && user.role === "admin";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Course</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail:
              </label>
              {imagePreview || course.thumbnail ? (
                <Image
                  src={imagePreview || course.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-40 object-cover mb-2 rounded"
                  unoptimized
                />
              ) : null}
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>
            {canEdit && (
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Update Course
                </button>
              </div>
            )}
          </form>
          {canDelete && (
            <button
              onClick={handleDelete}
              className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Delete Course
            </button>
          )}

          {/* Display chapters or a message if no chapters are available */}
          <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Chapters</h2>
            {chapters.length > 0 ? (
              <ul className="space-y-4">
                {chapters.map((chapter) => (
                  <li
                    key={chapter.id}
                    className="bg-white p-4 rounded-md shadow-md"
                  >
                    <div className="flex justify-between">
                      <span>chapter title: {chapter.title}</span>
                      <span>chapter order :{chapter.order}</span>

                      <Link
                        href={`/courses/${Id}/chapters/${chapter.order}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Edit Chapter
                      </Link>
                    </div>
                  </li>
                ))}
                <button
                  onClick={() =>
                    router.push(
                      `${process.env.NEXT_PUBLIC_APP_URL}/${course.title}`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  check course
                </button>
              </ul>
            ) : (
              <div>
                <button
                  onClick={() =>
                    router.push(
                      `${process.env.NEXT_PUBLIC_APP_URL}/${updatedData.title}`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  check course
                </button>
                <p>No chapters available for this course.</p>
                <Link
                  href={`/creator-dashboard/${Id}/create-chapters`}
                  className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md"
                >
                  Add Chapter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
