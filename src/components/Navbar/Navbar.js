"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icon from lucide-react

const Navbar = ({ setShowAuthPopup }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState(null); // Initialize as null

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser); // Set user data
      setUserName(parsedUser.name || "Guest"); // Set user name
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setIsAvatarDropdownOpen(false); // Close avatar dropdown
  };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen((prevState) => !prevState);
    setIsDropdownOpen(false); // Close creator dropdown
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 py-2 md:px-8 ">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800 flex-shrink-0 min-w-[100px]   cursive-regular ">
          <Link href="/">DAGULEARN</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
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

          {/* Show "Creator" button only for logged-in users with role "creator" */}
          {userData && userData.role === "creator" && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-blue-500 cursive-regular"
              >
                Creator
              </button>

              {/* Creator Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50 cursive-regular">
                  <Link
                    href="/creator-dashboard/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Creator Info
                  </Link>
                  <Link
                    href="/creator-dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Creator Dashboard
                  </Link>
                  <Link
                    href="/creator-agreement"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Creator Agreement
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Show "Hello, [Name]" and avatar dropdown for logged-in users */}
          {userData && (
            <div className="relative flex items-center space-x-2">
              <span className="text-black cursive-regular ">
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
                      setUserData(null); // Clear user data
                      setUserName("Guest"); // Reset username
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
                  className="hover:text-blue-500"
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
                <span className="text-gray-700 cursive-regular">
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
                        setUserData(null); // Clear user data
                        setUserName("Guest"); // Reset username
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
    </nav>
  );
};

export default Navbar;
