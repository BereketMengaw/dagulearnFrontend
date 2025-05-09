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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit Course
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description:
              </label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail:
              </label>
              {imagePreview || course.thumbnail ? (
                <Image
                  src={imagePreview || course.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover mb-4 rounded-lg shadow-md"
                  width={200}
                  height={200}
                  unoptimized
                />
              ) : null}
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            {canEdit && (
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Update Course
                </button>
              </div>
            )}
          </form>
          {canDelete && (
            <button
              onClick={handleDelete}
              className="mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300"
            >
              Delete Course
            </button>
          )}

          {/* Display chapters or a message if no chapters are available */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chapters</h2>
            {chapters.length > 0 ? (
              <ul className="space-y-4">
                {chapters.map((chapter) => (
                  <li
                    key={chapter.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-semibold text-gray-800">
                          {chapter.title}
                        </span>
                        <span className="block text-sm text-gray-500">
                          Order: {chapter.order}
                        </span>
                      </div>
                      <Link
                        href={`/courses/${Id}/chapters/${chapter.order}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
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
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                >
                  Check Course
                </button>
              </ul>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  No chapters available for this course.
                </p>
                <Link
                  href={`/creator-dashboard/${Id}/create-chapters`}
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
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
