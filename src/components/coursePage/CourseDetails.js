"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCheckCreator from "@/hooks/userCheckMiddleware";
import Image from "next/image";

export default function CourseDetails({ course, chapters }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Buy Now Only ");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [userNew, setUserNew] = useState(null);
  const [name, setName] = useState(null);
  const [gmail, setgmail] = useState(null);
  const [createId, setCreateId] = useState(null);
  const [creator, setCreator] = useState({});

  const router = useRouter();

  const courseId = course?.id;
  const price = course?.price;
  const realCreat = course?.creatorId;

  console.log(realCreat, "this is creator id number");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, []);

  console.log({ creator }, "this is the creator");

  useEffect(() => {
    if (!realCreat) {
      setLoading(false);
      return;
    }

    const checkCreator = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators/${realCreat}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.creator, "this is the ");
          if (data.creator) {
            setCreator(data.creator);
            console.log(data.creator, "this is the defined");
          }
        }
      } catch (error) {
        console.error("Error checking creator:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCreator();
  }, [realCreat]);

  console.log(creator, "this is the form data");

  //to get basic info of creator
  useEffect(() => {
    if (!creator?.userId) return;

    const fetchCreatorInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${realCreat}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch creator information");
        }
        const data = await response.json();
        setUserNew(data);
        console.log(data.data.name, "this is the user new");
        setgmail(data.data.gmail);
        setName(data.data.name);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorInfo();
  }, [creator?.userId, realCreat]);

  //to check enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && courseId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/check/${user.userId}/${courseId}`
          );
          const data = await response.json();
          if (data.enrolled) {
            setIsEnrolled(true);
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
    };

    checkEnrollment();
  }, [courseId, user]);

  const handleBuy = async () => {
    if (!user) {
      setButtonMessage("You need to login/signup  to buy this course.");
      setTimeout(() => setButtonMessage("Buy Now"), 5000);
      return;
    }

    const { name, phoneNumber, userId, gmail } = user;
    const [firstName, lastName] = name ? name.split(" ") : ["", ""];
    const transactionReference = `tx_${Date.now()}`;

    try {
      setLoading(true);

      const paymentData = {
        userId,
        courseId,
        amount: price,
        email: gmail,
        firstName,
        lastName,
        phoneNumber,
        txRef: transactionReference,
        callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/payments/callback`,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter) => {
    if (!user) {
      setErrorMessage("You need to log in to access the chapters.");
      return;
    }

    const isAdmin = user.role === "admin";
    const isCreator = user.userId === course.creatorId;

    if (isAdmin || isCreator || isEnrolled || chapter.order === 1) {
      router.push(`/courses/${courseId}/chapters/${chapter.order}`);
    } else {
      setErrorMessage(
        "You need to purchase this course to access its chapters."
      );
    }
  };

  const handleUpdateCourse = () => {
    router.push(`/courses/${courseId}/edit`);
  };

  const thumbnailUrl = course?.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : "/placeholder-thumbnail.jpg";

  if (!course) {
    return (
      <p className="text-center text-red-500 font-semibold">Course not found</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User and Creator Info Section */}

        <div className="bg-white p-8 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture on the Left */}
          {creator?.profilePicture && (
            <div className="w-32 h-32 flex-shrink-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${creator.profilePicture}`}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
          )}

          {/* Creator Information on the Right */}
          <div className="flex flex-col justify-center flex-grow space-y-4">
            {user && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About Creator
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span> {name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                      href={`mailto:${gmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {gmail}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {creator && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Experience:</span>{" "}
                    {creator.experience} years
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Education Level:</span>{" "}
                    {creator.educationLevel}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Skills:</span>{" "}
                    {creator.skills}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Location:</span>{" "}
                    {creator.location}
                  </p>
                </div>

                {/* Bio Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <span className="font-semibold">Bio:</span> {creator.bio}
                  </p>
                </div>

                {/* Social Links */}
                {creator.socialLinks?.linkedin && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">
                      LinkedIn:
                    </span>
                    <a
                      href={creator.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Details */}
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
          <Image
            className="w-full md:w-1/3 h-64 object-cover rounded-lg"
            src={thumbnailUrl}
            alt={course.title || "Course thumbnail"}
          />
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
            <p className="text-lg text-gray-600 mt-4">{course.description}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>Creator: {course.creator?.name || "Unknown"}</p>
              <p>Category: {course.category?.name || "Uncategorized"}</p>
              <p>
                Price: <span className="font-semibold">{course.price} ETB</span>
              </p>
            </div>
          </div>
        </div>

        {/* Buy Now / Ready to Learn Button */}
        <div className="text-center mt-8">
          {isEnrolled ? (
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              disabled
            >
              You Are Ready to Learn
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
                buttonMessage === "Buy Now"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-green-500 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : buttonMessage} {price} ETB
            </button>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-center text-red-600 font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Chapters Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Chapters</h2>
          {chapters.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.id}
                  className={`p-6 rounded-lg ${
                    user?.role === "admin" ||
                    user?.userId === course.creatorId ||
                    isEnrolled ||
                    chapter.order === 1
                      ? "bg-green-100 hover:bg-green-200 cursor-pointer"
                      : "bg-gray-100 hover:bg-gray-200 cursor-not-allowed"
                  } transition-all`}
                  onClick={() => handleChapterClick(chapter)}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-medium text-gray-800 ${
                        !isEnrolled && chapter.order !== 1
                          ? "text-gray-500"
                          : ""
                      }`}
                    >
                      {index + 1}. {chapter.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      Order: {chapter.order}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">
              No chapters available for this course.
            </p>
          )}
        </div>

        {/* Update Course Button for Admin and Creator */}
        {(user?.role === "admin" || user?.userId === course.creatorId) && (
          <div className="text-center mt-8">
            <button
              onClick={handleUpdateCourse}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition"
            >
              Update Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
