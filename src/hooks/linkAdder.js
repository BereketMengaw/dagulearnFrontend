// hooks/fetcher.js
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const addLink = async (linkData) => {
  try {
    const response = await fetch(`${apiUrl}/api/link/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkData),
    });

    if (!response.ok) {
      throw new Error("Failed to upload link");
    }

    return response.json(); // Assuming the response returns a JSON object
  } catch (error) {
    console.error("Error uploading link:", error);
    throw error;
  }
};
