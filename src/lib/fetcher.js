// /lib/fetcher.js
import axios from "axios";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchChaptersByCourseId = async (courseId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chapters/${courseId}/chapters/`
    );

    const data = await response.json();

    if (!response.ok) {
      console.warn(`Warning: ${data.message || "Failed to fetch chapters"}`);
      return []; // Return an empty array instead of throwing an error
    }

    return data;
  } catch (error) {
    console.error("Error in fetchChaptersByCourseId:", error.message);
    return []; // Return empty array on error to prevent UI from breaking
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchCourseById:", error.message);
    throw error;
  }
};

export async function fetchChapterDetails(chapterId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/videos/chapter/${chapterId}`
    );

    if (!res.ok) throw new Error("Failed to fetch chapter details");
    console.log(chapterId);
    return res.json();
  } catch (error) {
    console.error("Error in fetchChapterDetails:", error.message);
    throw error;
  }
}

export const fetchCreator = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${userId}`
    );
    const data = await response.json();

    if (response.ok && data.creator) {
      return data.creator;
    } else {
      throw new Error("Invalid creator data");
    }
  } catch (error) {
    console.error("Error fetching creator data:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category`
    );
    if (!response.ok) throw new Error("Failed to fetch categories");

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);

    throw error;
  }
};

export const fetchCourses = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
    );
    if (!response.ok) throw new Error("Failed to fetch courses");
    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const fetchEnrollmentsCount = async (courseId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/count/${courseId}`
    );
    if (!response.ok) throw new Error("Failed to fetch enrollment count");

    const data = await response.json();
    return data; // Assuming { enrollmentCount: number } is returned
  } catch (error) {
    return { enrollmentCount: 0 }; // Return default if an error occurs
  }
};

export const fetchCoursesByCreator = async (creatorId) => {
  if (!creatorId) return [];

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/creator/${creatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const fetchUserNameById = async (userId) => {
  if (!userId) return "Unknown User";

  try {
    console.log(userId);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`
    );
    return response.data.name; // Assuming the API returns { name: "User Name" }
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Unknown User";
  }
};

// utils/fetcher.js
export const fetchEarningsByCreatorId = async (creatorId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/earnings/creator/${creatorId}`
    );
    if (!response.ok) throw new Error("Failed to fetch earnings");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function fetchVideosByChapterAndCourse(courseId, order) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/videos/course/${courseId}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const videos = await res.json();

    // Get unique chapterIds and sort them by order
    const uniqueChapters = [
      ...new Set(videos.map((video) => video.chapterId)),
    ].sort((a, b) => a - b);

    console.log("Unique Chapters:", uniqueChapters); // Debugging

    // Ensure order is within range
    if (order < 1 || order > uniqueChapters.length) {
      throw new Error("Invalid chapter order");
    }

    // Get the real chapterId from the order
    const actualChapterId = uniqueChapters[order - 1]; // order 1 = first chapterId

    console.log("Mapped Order to Chapter ID:", order, "->", actualChapterId); // Debugging

    // Filter videos for the matched chapterId
    const filteredVideos = videos.filter(
      (video) => video.chapterId === actualChapterId
    );

    return { title: `Chapter ${order}`, videos: filteredVideos };
  } catch (error) {
    console.error("Error in fetchVideosByChapterAndCourse:", error.message);
    throw error;
  }
}

export async function fetchContentByChapterAndCourse(courseId, order) {
  const videoApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/videos/course/${courseId}/order/${order}`;

  try {
    const res = await fetch(videoApiUrl);
    const videos = res.ok ? await res.json() : [];

    let links = [];
    if (videos.length > 0) {
      try {
        links = await fetchLinksByChapter(videos[0]?.chapterId);
      } catch (linkError) {
        console.warn("Error fetching links:", linkError);
      }
    }

    return {
      title: `Chapter ${order}`,
      videos: Array.isArray(videos) ? videos : [],
      links: Array.isArray(links) ? links : [],
    };
  } catch (videoError) {
    console.warn("Error fetching videos:", videoError);

    try {
      const links = await fetchLinksByChapter(order);
      return {
        title: `Chapter ${order}`,
        videos: [],
        links: Array.isArray(links) ? links : [],
      };
    } catch (linkError) {
      console.warn("Error fetching links:", linkError);
      return {
        title: `Chapter ${order}`,
        videos: [],
        links: [],
      };
    }
  }
}

// Reuse the existing function to fetch links by chapter
export async function fetchLinksByChapter(chapterId) {
  try {
    console.log("chapterid is ", chapterId);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/link/links/chapter/${chapterId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch links");
    }
    const links = await response.json();
    return links;
  } catch (error) {
    set.error("Error fetching links:", error);
    return [];
  }
}

export async function fetchContentcByChapterAndCourse(courseId, chapterId) {
  // Validate courseId and chapterId
  if (!courseId || !chapterId) {
    throw new Error("Invalid course or chapter ID");
  }

  // Check if course exists (optional: can be adjusted depending on your backend)
  const courseResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`
  );
  const courseData = await courseResponse.json();

  if (!courseData) {
    throw new Error("Course not found");
  }

  // Check if chapter exists
  const chapterResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`
  );
  const chapterData = await chapterResponse.json();

  if (!chapterData) {
    throw new Error("Chapter not found");
  }

  return chapterData;
}

// Function to check if the user is enrolled in the course
export async function checkUserEnrollment(userId, courseId) {
  if (!userId || !courseId) {
    throw new Error("Invalid user ID or course ID");
  }

  const enrollmentResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/check/${userId}/${courseId}`
  );

  const enrollmentData = await enrollmentResponse.json();

  return enrollmentData;
}

export async function fetchCourseByName(courseName) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/course/${courseName}`
    );
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}
