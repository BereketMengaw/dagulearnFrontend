"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const useCheckCreator = (userId) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Track mount status

    const checkCreator = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/creator/creators/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setCreator(data.creator);
            console.log("Creator set:", data.creator);
            console.log(creator, "this is the binyam");
          }
        }
      } catch (error) {
        console.error("Error checking creator:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkCreator();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [userId]);

  return { creator, loading };
};

export default useCheckCreator;
