// fetcher.js
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchVideoByCourseAndOrder = async (courseId, order) => {
  try {
    const response = await fetch(`${apiUrl}/videos/course/101/order/1`);

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();

    if (data && Array.isArray(data.videos)) {
      return data.videos; // Return the list of videos as an array
    } else {
      throw new Error("No videos found");
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error; // Propagate error for handling in the component
  }
};
