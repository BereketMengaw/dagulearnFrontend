"use client";

import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerCreator, updateCreator } from "@/lib/api";
import useCheckCreator from "@/hooks/userCheckMiddleware";
import axios from "axios";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CreatorRegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  const educationLevels = [
    "Certificate",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Postgraduate",
  ];

  const banksInEthiopia = [
    "Commercial Bank of Ethiopia",
    "Dashen Bank",
    "Awash Bank",
    "Bank of Abyssinia",
    "United Bank",
    "Nib International Bank",
    "Wegagen Bank",
    "Cooperative Bank of Oromia",
    "Berhan Bank",
    "Zemen Bank",
    "Bunna International Bank",
    "Abay Bank",
    "Addis International Bank",
    "Debub Global Bank",
    "Enat Bank",
  ];

  const addisAbabaDistricts = [
    "Addis Ababa",
    "Adama (Nazret)",
    "Hawassa",
    "Bahir Dar",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Jimma",
    "Harar",
    "Dessie",
    "Shashemene",
    "Arba Minch",
    "Debre Markos",
    "Debre Birhan",
    "Nekemte",
    "Weldiya",
    "Asella",
    "Hosaena",
    "Gambela",
    "Semera",
    "Jijiga",
    "Sodo",
    "Bishoftu (Debre Zeit)",
    "Axum",
  ];

  useEffect(() => {
    if (!userData?.userId) {
      router.push("auth/login");
    } else if (userData.role !== "creator") {
      router.push("/"); // Redirect to homepage if not a creator
    }
  }, [userData, router]);

  const { creator, loading } = useCheckCreator(userData?.userId);

  useEffect(() => {
    if (creator) {
      setFormData({
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        gmail: userData.gmail || "",
        bio: creator.bio || "",
        educationLevel: creator.educationLevel || "",
        experience: creator.experience || "",
        skills: creator.skills || "",
        location: creator.location || "",
        socialLinks: { linkedin: creator.socialLinks?.linkedin || "" },
        bankType: creator.bankType || "",
        bankAccount: creator.bankAccount || "",
      });
    }
  }, [creator, userData]); // Add 'userData' as a dependency

  useEffect(() => {
    console.log("Creator:", creator);
    console.log("Loading:", loading);
    console.log("User Data:", userData);

    if (!loading && (creator === null || creator === undefined)) {
      console.log("Redirecting to /creator-dashboard/notRegisterd");
      router.push("/creator-dashboard/notRegisterd");
    }
  }, [creator, loading, router]);

  if (loading) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (creator) {
        // Remove profilePicture from formData before sending it to updateCreator
        const { profilePicture, ...dataToSend } = formData;
        response = await updateCreator(userData.userId, dataToSend);
      } else {
        response = await registerCreator(formData);
      }

      if (response.success) {
        alert(
          creator
            ? "Profile updated successfully!"
            : "Creator registered successfully!"
        );
        setIsEditing(false);
      } else {
        setErrors({ general: response.message || "Something went wrong." });
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!formData.profilePicture) {
      alert("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profilePicture", formData.profilePicture);

      const response = await axios.put(
        `${apiUrl}/creator/creators/${creator.id}/profile-picture`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Profile picture updated successfully!");
        // Update the form data with the new profile picture URL
        setFormData((prev) => ({
          ...prev,
          profilePicture: response.data.profilePictureUrl,
        }));
      } else {
        setErrors({
          general: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {creator ? "Your Creator Profile" : "Creator Registration"}
        </h2>

        {errors.general && (
          <div className="text-red-500 mb-4 text-center">{errors.general}</div>
        )}

        {!isEditing && creator ? (
          <div className="text-gray-700 space-y-4">
            <div className="flex flex-col items-center">
              <p className="font-bold mb-2">Profile Picture:</p>
              {creator.profilePicture && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${creator.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Full Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Phone Number:</strong> {userData.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {userData.gmail}
              </p>
              <p>
                <strong>Bio:</strong> {creator.bio}
              </p>
              <p>
                <strong>Education Level:</strong> {creator.educationLevel}
              </p>
              <p>
                <strong>Experience:</strong> {creator.experience}
              </p>
              <p>
                <strong>Skills:</strong> {creator.skills}
              </p>
              <p>
                <strong>Location:</strong> {creator.location}
              </p>

              <p>
                <strong>Bank Name:</strong> {creator.bankType}
              </p>
              <p>
                <strong>Bank Account:</strong> {creator.bankAccount}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
            <div className="flex justify-center items-center py-4 bg-gray-100">
              <Link href="/creator-dashboard">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out">
                  Go to Creator Dashboard
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Profile Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleChange}
                  placeholder={userData.name}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={userData?.phoneNumber || ""}
                  onChange={handleChange}
                  placeholder={userData.phoneNumber}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  name="gmail"
                  value={formData?.gmail || ""}
                  onChange={handleChange}
                  placeholder={userData.gmail}
                  className="w-full p-2 border rounded-md"
                />
                <textarea
                  name="bio"
                  value={formData?.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="w-full p-2 border rounded-md"
                />
                <select
                  name="educationLevel"
                  value={formData?.educationLevel || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select your education level</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="experience"
                  value={formData?.experience || ""}
                  onChange={handleChange}
                  placeholder="Experience"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  name="skills"
                  value={formData?.skills || ""}
                  onChange={handleChange}
                  placeholder="Skills"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  name="location"
                  value={formData?.location || ""}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-2 border rounded-md"
                />

                <select
                  name="bankType"
                  value={formData?.bankType || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select your bank</option>
                  {banksInEthiopia.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData?.bankAccount || ""}
                  onChange={handleChange}
                  placeholder="Bank Account Number"
                  className="w-full p-2 border rounded-md"
                />

                <button
                  type="submit"
                  className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>

              {/* Bottom button with link */}
              <Link href="/creator-dashboard">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out">
                  Go to Creator Dashboard
                </button>
              </Link>
            </div>

            {/* Profile Picture Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center space-y-4">
                {formData?.profilePicture && (
                  <Image
                    src={
                      typeof formData.profilePicture === "string"
                        ? formData.profilePicture
                        : URL.createObjectURL(formData.profilePicture)
                    }
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border border-gray-300"
                  />
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={handleUpdateProfilePicture}
                  className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Update Profile Picture"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatorRegistrationForm;
