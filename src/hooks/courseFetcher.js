export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchCourse = async (courseId) => {
  const res = await fetch(`${apiUrl}/api/courses/${courseId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch course");
  }
  return res.json();
};

export const updateCourse = async (courseId, courseData) => {
  const res = await fetch(`${apiUrl}/api/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });

  if (!res.ok) {
    throw new Error("Failed to update course");
  }
  return res.json();
};
