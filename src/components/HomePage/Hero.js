"use client";

import Image from "next/image";
import AuthPopup from "@/app/auth/AuthPopup";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const Hero = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure it's running on the client
      setStoredUser(localStorage.getItem("user"));
    }
  }, []);

  return (
    <section
      className="relative h-screen flex items-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/bgimgtwo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay - Always present */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Gradient Overlay - Only on large screens */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 1.3), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0),rgba(0, 0, 0, 0),rgba(0, 0, 0, 0))",
        }}
      ></div>

      <div className="container mx-auto px-6 lg:px-24 relative z-10 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6 ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            Welcome to <span className="text-purple-700">Dagulearn </span>Course
            Sharing Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">
            Empowering educators and students to connect and share knowledge for
            better, quality education. <br />
            Learn anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Get Started
            </button>
            {/* Show Login button only if user is not logged in */}
            {!storedUser && (
              <button
                onClick={() => setShowAuthPopup(true)}
                className="px-6 py-3 border border-white text-white font-medium rounded-lg shadow-md hover:bg-white hover:text-black transition"
              >
                Sign Up / Login
              </button>
            )}

            {/* Show Dashboard button if user is logged in */}
            {storedUser && (
              <button
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="px-6 py-3 border border-white text-white font-medium rounded-lg shadow-md hover:bg-white hover:text-black transition"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end"></div>
      </div>

      {/* Auth Popup */}
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </section>
  );
};

export default Hero;
