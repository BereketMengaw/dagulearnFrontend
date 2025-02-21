"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icon from lucide-react

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState();

  useEffect(() => {
    setUserData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name) {
      setUserName(userData.name);
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
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800 flex-shrink-0 min-w-[100px]">
          <Link href="/">ASTEMARI</Link>
        </div>

        {/* Search Bar (Hidden on Small Screens) */}
        <div className="hidden md:flex flex-grow mx-4">
          <input
            type="text"
            placeholder="Search for anything"
            className="w-40 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {userName !== "Guest" && (
            <div className="relative">
              {userData.role === "creator" && (
                <button
                  onClick={toggleDropdown}
                  className="hover:text-blue-500"
                >
                  Creator
                </button>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    href="creator-dashboard/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Register
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
          {userName === "Guest" && (
            <>
              <Link
                href="auth/login"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
              >
                Login
              </Link>
              <Link
                href="auth/signup"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300 ml-4"
              >
                Signup
              </Link>
            </>
          )}

          {/* Avatar Dropdown */}
          <div className="relative flex items-center space-x-2">
            <span className="text-gray-700">Hello, {userName}</span>

            {userName !== "Guest" && (
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
            )}

            {isAvatarDropdownOpen && userName !== "Guest" && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUserName("Guest");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
            {userName === "Guest" ? (
              <>
                <Link
                  href="auth/login"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="auth/signup"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                {/* Creator Dropdown */}
                {userData.role === "creator" && (
                  <button
                    onClick={toggleDropdown}
                    className="hover:text-blue-500"
                  >
                    Creator
                  </button>
                )}
                {isDropdownOpen && (
                  <div className="flex flex-col space-y-4 mt-2">
                    <Link
                      href="creator-dashboard/register"
                      className="hover:bg-gray-100 px-4 py-2"
                    >
                      Register
                    </Link>
                    <Link
                      href="/creator-dashboard"
                      className="hover:bg-gray-100 px-4 py-2"
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

                {/* Avatar Dropdown */}
                <div className="relative">
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

                  {isAvatarDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          localStorage.removeItem("user");
                          setUserName("Guest");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
