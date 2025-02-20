import axios from "axios";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// api.js - For managing requests
export const signUp = async (phoneNumber, password) => {
  const res = await fetch(`${apiUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, password }),
  });

  return res.json();
};

export const signIn = async (phoneNumber, password) => {
  const res = await fetch(`${apiUrl}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, password }),
  });

  return res.json();
};

export const fetchEnrollmentsCount = async (courseId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/enrollments/counts/${courseId}`
    );
    return response.data;
  } catch (error) {
    // Ignore the error, or log a custom message instead of the error
    console.log(`Error fetching enrollment count for course `);
  }
};

export const addChapterToAPI = async (chapter, courseId) => {
  const response = await fetch(`${apiUrl}/api/chapters/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: chapter.title,
      order: chapter.order,
      courseId,
    }),
  });

  if (!response.ok) throw new Error("Failed to add chapter");
  return response.json();
};

export const addVideoToAPI = async (video, chapterId, courseId) => {
  const response = await fetch(`${apiUrl}/videos/${courseId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: video.title, url: video.url, chapterId }),
  });

  if (!response.ok) throw new Error("Failed to add video");
};

export async function fetchEnrollments(courseId) {
  try {
    const response = await fetch(`${apiUrl}/enrollments/course/${courseId}`);
    if (!response.ok) throw new Error("Failed to fetch enrollments");
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

// apiService.js
export const registerCreator = async (formData) => {
  const formDataToSubmit = new FormData();

  // Append fields to FormData (for file handling)
  for (let key in formData) {
    if (key === "socialLinks") {
      formDataToSubmit.append(
        "socialLinks",
        JSON.stringify(formData.socialLinks)
      );
    } else {
      formDataToSubmit.append(key, formData[key]);
    }
  }

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await fetch(`${apiUrl}/creator/creators`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Send token in the request
      },
      body: formDataToSubmit,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register creator.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Network error. Please try again later.");
  }
};

export const fetchCreator = async (userId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch creator data");
  }
  return response.json();
};

export const updateCreator = async (userId, data) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update creator data");
  }
  return response.json();
};
