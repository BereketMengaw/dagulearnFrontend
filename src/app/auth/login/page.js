"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        phoneNumber: fullPhoneNumber,
        password,
      });

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
    <div className="flex  bg-gray-100 justify-center items-center px-4 sm:px-8 ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
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
                  const input = e.target.value.replace(/\D/g, "");
                  if (input.length <= 9) setPhoneNumber(input);
                }}
                className="w-full px-4 py-2 focus:outline-none"
                required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3/4 transform -translate-y-1/2 cursor-pointer text-lg"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
