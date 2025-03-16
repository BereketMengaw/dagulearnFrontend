"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react"; // Import the close icon

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AuthPage = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLoginSubmit = async (e) => {
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

        // Close the popup after successful login
        onClose();

        // Refresh the page after login
        router.refresh(); // If using App Router
        window.location.reload(); // Use this if App Router refresh doesn't work

        // Redirect to the home page or dashboard
        router.push("/");
      } else {
        setErrorMessage("Invalid phone number or password.");
      }
    } catch (error) {
      setErrorMessage("Invalid phone number or password.");
    }
  };

  const handleSignupSubmit = async (e) => {
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
      const signupResponse = await axios.post(
        `${apiUrl}/api/users/create`,
        formData
      );

      if (signupResponse.data.status === "success") {
        setSuccess("User created successfully! Logging in...");

        // Automatically log in the user
        const loginResponse = await axios.post(`${apiUrl}/api/auth/login`, {
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });

        if (
          loginResponse.data.status === "success" &&
          loginResponse.data.token
        ) {
          const { token, userId, name, phoneNumber, role, gmail } =
            loginResponse.data;
          localStorage.setItem(
            "user",
            JSON.stringify({ userId, name, phoneNumber, role, gmail })
          );
          localStorage.setItem("token", token);

          setTimeout(() => {
            onClose(); // Close the popup
            router.refresh(); // Refresh the page
            window.location.reload(); // Use this if App Router refresh doesn't work
            router.push("/"); // Redirect to home/dashboard
          }, 2000);
        } else {
          setError(
            "Signup successful, but login failed. Please try logging in manually."
          );
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <Tabs defaultValue="login" className="w-[350px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Welcome back!</h2>
                <p className="text-sm mt-2">Please enter your details</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
          </TabsContent>
          <TabsContent value="signup">
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>

              {error && (
                <p className="text-red-500 mb-4 text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-500 mb-4 text-center">{success}</p>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleSignupChange}
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
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Gmail
                  </label>
                  <input
                    type="email"
                    name="gmail"
                    autoComplete="email"
                    value={formData.gmail}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    placeholder="Enter your Gmail"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 bg-gray-100 text-gray-700 border-r border-gray-300">
                      +251
                    </span>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="9XXXXXXXX"
                      value={formData.phoneNumber.replace("+251", "")} // Ensure consistent format
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (input.length <= 9) {
                          setFormData((prevData) => ({
                            ...prevData,
                            phoneNumber: `+251${input}`,
                          }));
                        }
                      }}
                      className="w-full px-4 py-2 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="relative mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3/4 transform -translate-y-1/2 cursor-pointer text-lg"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                >
                  Signup
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
