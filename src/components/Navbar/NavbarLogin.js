"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState(null); // For role-based display

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.name);
      setUserRole(userData.role); // Assuming role is stored in user data
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800 flex-shrink-0 min-w-[100px]">
          <Link href="/">ASTEMARI</Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-800 focus:outline-none"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4 hidden md:flex">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for anything"
              className="w-40 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Conditional Menu Based on Role */}
          {userRole === "creator" || userRole === "admin" ? (
            <Link
              href="/creator-dashboard"
              className="text-gray-700 hover:text-blue-500"
            >
              Creator Dashboard
            </Link>
          ) : null}

          {/* Greeting and Avatar Dropdown */}
          <div className="relative flex items-center space-x-2">
            <span className="text-gray-700">Hello, {userName}</span>
            <button
              onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
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
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow">
          <div className="flex flex-col items-center space-y-4 py-4">
            {/* Role-based menu options */}
            {userRole === "creator" || userRole === "admin" ? (
              <Link
                href="/creator-dashboard"
                className="text-gray-700 hover:text-blue-500"
              >
                Creator Dashboard
              </Link>
            ) : null}

            {/* Login/Signup for guest */}
            {userName === "Guest" && (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-blue-500 hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Other Links */}
            <Link
              href="/creator-agreement"
              className="hover:bg-gray-100 text-gray-700"
            >
              Creator Agreement
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
