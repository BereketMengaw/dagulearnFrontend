"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import Logo from "../../../../public/images/message.jpg";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhoneNumber = `+251${phoneNumber}`;

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`, // Updated to use the environment variable for API URL
        {
          phoneNumber: fullPhoneNumber,
          password,
        }
      );

      if (response.data.status === "success" && response.data.token) {
        const { token, userId, name, phoneNumber, role, gmail } = response.data;
        localStorage.setItem(
          "user",
          JSON.stringify({ userId, name, phoneNumber, role, gmail })
        );
        localStorage.setItem("token", token);

        router.push("/");
      } else {
        setErrorMessage("Invalid phone number or password.");
      }
    } catch (error) {
      setErrorMessage("Invalid phone number or password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left Side - Full-Screen Image (Hidden on small screens) */}
        <div className="flex-1 hidden md:flex justify-center items-center relative  bg-gray-100">
          {/* Background Image */}
          <Image src={Logo} alt="Login" className="w-3/4 h-1/2" />

          {/* Text Container */}
          <div className="absolute top-30  left-0 w-full flex flex-col items-center px-4">
            <p className="text-black text-xs sm:text-sm md:text-base font-medium text-center leading-tight font-[Caveat]">
              Unlock your potential with Astemari. <br />
              Learn from the best and grow your knowledge. <br />
              take your learning to the next level!
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex justify-center items-center px-4 sm:px-8 md:px-16 bg-gray-100">
          <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold">Welcome back!</h2>
              <p className="text-lg mt-2">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 bg-gray-100 text-gray-700 border-r border-gray-300">
                    +251
                  </span>
                  <input
                    id="phoneNumber"
                    type="text"
                    placeholder="9XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (input.length <= 9) {
                        setPhoneNumber(input);
                      }
                    }}
                    className="w-full px-4 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3/4 transform -translate-y-1/2 cursor-pointer text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/auth/signup`} // Updated to use the environment variable for app URL
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
