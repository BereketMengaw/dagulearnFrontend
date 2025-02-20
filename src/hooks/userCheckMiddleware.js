"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const useCheckCreator = (userId) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkCreator = async () => {
      try {
        const response = await fetch(
          ` ${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.creator) {
            setCreator(data.creator);
          }
        }
      } catch (error) {
        console.error("Error checking creator:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCreator();
  }, [userId, router]);

  return { creator, loading };
};

export default useCheckCreator;
