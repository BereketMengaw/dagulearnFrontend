"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Navbar } from "@material-tailwind/react";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.userId) {
      setUserId(userData.userId);
    } else {
      alert("You must be logged in to register as a creator.");
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = {
      userId,
      ...formData,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/creator/creators`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Creator registration successful!");
        router.push("/creator-dashboard");
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
          Become an Astemari Creator 🎓
        </h2>

        {errors.general && (
          <div className="text-red-500 mb-4 text-center">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself in a few words..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            placeholder="Highest education level (e.g., BSc in Computer Science)"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of experience in teaching or your field"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="What skills do you bring? (e.g., Programming, Math, Design)"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          {/* Ethiopian Cities Dropdown */}
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

          <input
            type="text"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            placeholder="Enter your bank account number (e.g., 100012345678)"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Join Astemari 🚀"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatorRegistrationForm;
