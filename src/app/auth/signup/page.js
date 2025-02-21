"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import Navbar from "@/components/Navbar/NavbarLogin";

// Import images for different roles
import Creator1 from "../../../../public/images/formFilling.png";
import Creator2 from "../../../../public/images/addingCourse.png";
import Creator3 from "../../../../public/images/sellingCourse.png";

import Student1 from "../../../../public/images/going.png";
import Student2 from "../../../../public/images/choosing.png";
import Student3 from "../../../../public/images/learning.png";
import DefaultImage from "../../../../public/images/creator1.jpg";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    gmail: "",
    role: "student",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const creatorImages = [Creator1, Creator2, Creator3];
  const creatorTexts = [
    "Sign up or log in to get started.",
    "Register as a creator and verify your account.",
    "Upload your course content and set your pricing.",
  ];

  const studentImages = [Student1, Student2, Student3];
  const studentTexts = [
    "Sign up or log in to explore courses.",
    "Browse and purchase courses of your choice.",
    "Enjoy learning and upgrading your skills.",
  ];

  // Automatically cycle through steps
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (formData.role === "creator") {
          return (prevIndex + 1) % creatorImages.length;
        } else if (formData.role === "student") {
          return (prevIndex + 1) % studentImages.length;
        }
        return prevIndex;
      });
    }, 4000); // Change step every 4 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [formData.role, creatorImages.length, studentImages.length]); // Added dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.gmail ||
      !formData.password
    ) {
      setError("All fields are required. Please fill in every section.");
      return;
    }

    const phoneRegex = /^\+251\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError(
        "Please enter a valid phone number in the format: +251912345678."
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.gmail)) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,
        formData
      );
      if (response.data.status === "success") {
        setSuccess("User created successfully! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex h-screen">
        {/* Left Side - Dynamic Hero Image Section (Hidden on Small Screens) */}
        <div className="flex-1 hidden md:flex flex-col justify-center items-center p-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">
            {formData.role === "creator"
              ? "How to Become a Creator"
              : formData.role === "student"
              ? "How to Start Learning"
              : "Welcome to Astemari"}
          </h2>

          {/* Image Container */}
          <div className="relative w-3/4 h-64 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={
                formData.role === "creator"
                  ? creatorImages[currentImageIndex]
                  : formData.role === "student"
                  ? studentImages[currentImageIndex]
                  : DefaultImage
              }
              alt="Role-based Guide"
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Step Description */}
          <p className="text-lg text-center mt-4 px-6">
            {formData.role === "creator"
              ? creatorTexts[currentImageIndex]
              : formData.role === "student"
              ? studentTexts[currentImageIndex]
              : "Join Astemari and unlock learning and teaching opportunities."}
          </p>

          {/* Progress Dots */}
          <div className="flex mt-4 space-x-2">
            {Array.from(
              {
                length:
                  formData.role === "creator"
                    ? creatorImages.length
                    : formData.role === "student"
                    ? studentImages.length
                    : 1,
              },
              (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentImageIndex === index
                      ? "bg-indigo-600"
                      : "bg-gray-300"
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex justify-center items-center bg-gray-100 p-6">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && (
              <p className="text-green-500 mb-4 text-center">{success}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                >
                  <option value="student">Student</option>
                  <option value="creator">Creator</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="e.g., +251912345678"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Gmail</label>
                <input
                  type="email"
                  name="gmail"
                  autoComplete="email"
                  value={formData.gmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="Enter your Gmail"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                Signup
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
