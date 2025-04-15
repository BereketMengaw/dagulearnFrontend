"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar.js";

const CreatorRegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: "",
    educationLevel: "",
    experience: "",
    skills: "",
    location: "",
    socialLinks: "",
    bankAccount: "",
    bankType: "",
    profilePicture: null, // Added for file upload
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser, "this is the parsed user");
      setUserData(parsedUser); // Set user data
      setUserId(parsedUser.userId); // Set userId from parsedUser
    }
    setIsLoading(false); // Mark loading as complete
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profilePicture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format socialLinks as a JSON object
    const socialLinks = formData.socialLinks
      ? JSON.stringify({ linkedin: formData.socialLinks }) // Format as JSON string
      : null;

    // Prepare the data to send
    const dataToSend = {
      userId: userData.userId, // Include userId from state
      bio: formData.bio,
      educationLevel: formData.educationLevel,
      experience: formData.experience,
      skills: formData.skills,
      location: formData.location,
      socialLinks, // Use the formatted JSON string
      bankAccount: formData.bankAccount,
      bankType: formData.bankType,
    };

    console.log(dataToSend, "this is data to send ");

    // If profilePicture is included, append it to FormData
    const formDataToSend = new FormData();
    for (const key in dataToSend) {
      formDataToSend.append(key, dataToSend[key]);
    }
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(dataToSend, "this is data to send ");

      if (response.data.success) {
        alert("Creator registration successful!");
        router.push("/creator-dashboard/register");
      } else {
        setErrors({
          general: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Become an Dagulearn Creator 🎓
        </h2>

        {errors.general && (
          <div className="text-red-500 mb-4 text-center">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture Upload */}

          {/* Bio */}
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself in a few words..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          {/* Education Level */}
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">Select your education level</option>
            <option value="High School">High School</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>

          {/* Experience */}
          <input
            type="number" // Change type to "number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of experience in teaching or your field"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            min="0" // Optional: Set a minimum value (e.g., 0)
            step="1" // Optional: Ensure only whole numbers are allowed
          />

          {/* Skills */}
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="What skills do you bring? (e.g., Programming, Math, Design)"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          {/* Location */}
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">Select your city</option>
            <option value="Addis Ababa">Addis Ababa</option>
            <option value="Dire Dawa">Dire Dawa</option>
            <option value="Mekelle">Mekelle</option>
            <option value="Bahir Dar">Bahir Dar</option>
            <option value="Hawassa">Hawassa</option>
            <option value="Gondar">Gondar</option>
            <option value="Adama">Adama</option>
            <option value="Jimma">Jimma</option>
            <option value="Harar">Harar</option>
            <option value="Dessie">Dessie</option>
            <option value="Shashemene">Shashemene</option>
          </select>

          {/* Social Links */}
          <input
            type="text"
            name="socialLinks"
            value={formData.socialLinks}
            onChange={handleChange}
            placeholder="Drop your LinkedIn, Twitter, or portfolio link"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          {/* Bank Selection */}
          <select
            name="bankType"
            value={formData.bankType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">Choose your bank</option>
            <option value="Awash Bank">Awash Bank</option>
            <option value="Commercial Bank of Ethiopia">
              Commercial Bank of Ethiopia
            </option>
            <option value="Dashen Bank">Dashen Bank</option>
            <option value="Bank of Abyssinia">Bank of Abyssinia</option>
          </select>

          {/* Bank Account */}
          <input
            type="text"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            placeholder="Enter your bank account number (e.g., 100012345678)"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update Profile"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatorRegistrationForm;
