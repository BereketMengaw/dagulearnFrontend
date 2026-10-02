"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudioShell, { Card, Field, StudioLoading } from "@/components/studio/StudioShell";
import CourseSteps from "@/components/studio/CourseSteps";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchCategories } from "@/lib/fetcher";
import useCheckCreator from "@/hooks/userCheckMiddleware"; // ✅ Import the middleware

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CourseCreate() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [creatorId, setCreatorId] = useState();
  const [created, setCreated] = useState(false);

  // Retrieve user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setCreatorId(parsedUser.userId);
      }
    }
  }, [router]);

  // ✅ Check if user is a creator
  const { creator, loading: checkingCreator } = useCheckCreator(
    userData?.userId
  );

  useEffect(() => {
    if (!checkingCreator && (creator === false || creator === null)) {
      router.push(
        `${process.env.NEXT_PUBLIC_APP_URL}/creator-dashboard/register`
      );
    }
  }, [checkingCreator, creator, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setErrorMessage("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData || !userData.userId) {
        throw new Error("User not found.");
      }

      // Step 1: Fetch all courses
      const response = await fetch(`${apiUrl}/api/courses`);
      const allCourses = await response.json();

      // Step 2: Check if a course with the same title already exists
      const isDuplicate = allCourses.some(
        (course) =>
          course.title.toLowerCase() === courseData.title.toLowerCase()
      );

      if (isDuplicate) {
        throw new Error("A course with this title already exists.");
      }

      // Step 3: Create the course if the title is unique
      const coursePayload = {
        ...courseData,
        creatorId: userData.userId,
      };

      const createResponse = await fetch(`${apiUrl}/api/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coursePayload),
      });

      const data = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(data.message || "Failed to create course.");
      }

      // Redirect to the thumbnail upload page
      router.push(`/creator-dashboard/${data.course.id}/upload-thumbnail`);
      console.log("The course ID is", data.course.id);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingCreator) {
    return (
      <StudioShell title="Create a course">
        <StudioLoading />
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Create a course"
      subtitle="Start with the basics. You'll add a thumbnail and chapters next."
    >
      <CourseSteps current={1} />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card>
          {errorMessage && (
            <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Course title" htmlFor="title" hint="Learners see this first. Keep it clear and specific.">
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Full-Stack Web Dev with Next.js"
              />
            </Field>

            <Field label="Description" htmlFor="description">
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
                rows="5"
                className="input"
                placeholder="What will learners be able to do after this course?"
              ></textarea>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Price (ETB)" htmlFor="price">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={courseData.price}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g. 350"
                />
              </Field>

              <Field label="Category" htmlFor="categoryId">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={courseData.categoryId}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
              </Field>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating course…
                  </>
                ) : (
                  <>
                    Create course <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

        <Card className="h-fit bg-brand-50/50">
          <p className="eyebrow">Tips</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>Chapter 1 is free for everyone, so make it a strong preview.</li>
            <li>You keep 80% of every sale; DaguLearn keeps 20%.</li>
            <li>Videos stay on YouTube. You&apos;ll paste their links per chapter.</li>
          </ul>
        </Card>
      </div>
    </StudioShell>
  );
}
