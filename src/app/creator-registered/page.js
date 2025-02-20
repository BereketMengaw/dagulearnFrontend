"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CreatorRegistered = () => {
  const router = useRouter();

  useEffect(() => {
    // Optionally, you can add a timer to redirect to the homepage after a few seconds
    setTimeout(() => {
      router.push("/"); // Redirect to the homepage
    }, 5000); // Redirect after 5 seconds (adjust as needed)
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Creator Registration Successful!
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Congratulations! You have successfully registered as a content
          creator.
        </p>
        <p className="text-gray-700 text-center mb-4">
          You will be redirected to the homepage in a few seconds.
          Alternatively, you can click the button below to proceed manually.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-md"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatorRegistered;
