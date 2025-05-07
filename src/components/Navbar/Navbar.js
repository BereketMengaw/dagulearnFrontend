"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import User from "./UserNav";
import Modal from "../popupVideo/popup"; // Import the Modal component
import favicon from "../../../public/favicon.png"; // Adjust the path to your favicon
import Image from "next/image";

const Navbar = ({ setShowAuthPopup }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState(null);

  // State for the video modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Video URLs
  const videos = {
    student: "https://www.youtube.com/embed/cggp1iwYA4w", // Updated embed URL
    creator: "https://www.youtube.com/embed/cggp1iwYA4w",
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setUserName(parsedUser.name || "Guest");
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setIsAvatarDropdownOpen(false);
  };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen((prevState) => !prevState);
    setIsDropdownOpen(false);
  };

  const openVideoModal = (videoType) => {
    setSelectedVideo(videos[videoType]);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 p-2 w-full">
      <div className="flex items-center justify-between px-4 py-2 md:px-8 ">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="group">
            <div className="flex ">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight lg:cursive-regular transition-all group-hover:from-purple-700 group-hover:to-blue-700">
                  DAGULEARN
                </span>
                <Image
                  src={favicon}
                  className="h-8 w-auto" // Adjusted to fixed height with auto width
                  alt="DAGULEARN logo icon"
                  width={32} // Added explicit width
                  height={32} // Added explicit height
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-[-4px] tracking-wide">
              Ethiopia&lsquo;s first YouTube course monetization platform
            </p>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Learn How It Works Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-50"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              Learn How It Works ?
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    openVideoModal("student");
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  For Students
                </button>
                <button
                  onClick={() => {
                    openVideoModal("creator");
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  For Creators
                </button>
              </div>
            )}
          </div>

          {/* Show login/signup buttons for guests */}
          {!userData && (
            <>
              <div>
                <button
                  onClick={() => setShowAuthPopup(true)}
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    {" "}
                    Login / Signup
                  </span>
                </button>
              </div>
            </>
          )}

          <User
            userData={userData}
            userName={userName}
            setUserData={setUserData}
            setUserName={setUserName}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none p-2 rounded-md text-gray-700"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow">
          <div className="flex flex-col items-center space-y-4 py-4">
            {/* Learn How It Works in mobile */}
            <div className="w-full text-center">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 bg-slate-400 rounded-md "
              >
                Learn How It Works ?
              </button>

              {isDropdownOpen && (
                <div className="flex flex-col items-center space-y-2 mt-2">
                  <button
                    onClick={() => openVideoModal("student")}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    For Students
                  </button>
                  <button
                    onClick={() => openVideoModal("creator")}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    For Creators
                  </button>
                </div>
              )}
            </div>

            {/* Rest of the mobile menu items... */}
            {/* Show login/signup buttons for guests */}
            {!userData && (
              <>
                <button
                  onClick={() => setShowAuthPopup(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                >
                  Login / Signup
                </button>
              </>
            )}

            {/* Show "Creator" button only for logged-in users with role "creator" */}
            {userData && userData.role === "creator" && (
              <>
                <button
                  onClick={toggleDropdown}
                  className="hover:text-blue-500 bg-gray-500 rounded-md p-1"
                >
                  Creator
                </button>

                {/* Creator Dropdown */}
                {isDropdownOpen && (
                  <div className="flex flex-col space-y-4 mt-2">
                    <Link
                      href="/creator-dashboard/register"
                      className="hover:bg-gray-100 px-4 py-2 cursive-regular"
                    >
                      Creator Info
                    </Link>
                    <Link
                      href="/creator-dashboard"
                      className="hover:bg-gray-100 px-4 py-2 cursive-regular"
                    >
                      Creator Dashboard
                    </Link>
                    <Link
                      href="/creator-agreement"
                      className="hover:bg-gray-100 px-4 py-2"
                    >
                      Creator Agreement
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Show "Hello, [Name]" and avatar dropdown for logged-in users */}
            {userData && (
              <div className="relative">
                <span className="text-gray-700 cursive-regular ">
                  Hello, {userName}
                </span>

                <button
                  onClick={toggleAvatarDropdown}
                  className="focus:outline-none"
                >
                  <span
                    role="img"
                    aria-label="avatar"
                    className="text-2xl bg-gray-200 rounded-full p-2 text-gray-800"
                  >
                    🧑‍🎓
                  </span>
                </button>

                {/* Avatar Dropdown */}
                {isAvatarDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-600"
                      onClick={() => {
                        localStorage.removeItem("user");
                        setUserData(null);
                        setUserName("Guest");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoUrl={selectedVideo}
      />
    </nav>
  );
};

export default Navbar;
