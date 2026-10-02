"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import StudioShell, { Card, Field } from "@/components/studio/StudioShell";

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
  const [success, setSuccess] = useState("");

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
        setSuccess("Creator registration successful!");
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

  const sel = (name, placeholder, options) => (
    <select id={name} name={name} value={formData[name]} onChange={handleChange} className="input">
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <StudioShell
      title="Become a DaguLearn creator"
      subtitle="Set up your creator profile once. Learners see it on every course you publish."
    >
      {errors.general && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.general}</p>
      )}
      {success && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
      )}

      <Card className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Bio" htmlFor="bio" hint="A few sentences learners will read before buying.">
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself in a few words..."
              className="input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Education level" htmlFor="educationLevel">
              {sel("educationLevel", "Select your education level", ["High School", "Bachelor", "Master", "PhD", "Other"])}
            </Field>
            <Field label="Years of experience" htmlFor="experience">
              <input
                id="experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience in teaching or your field"
                className="input"
                min="0"
                step="1"
              />
            </Field>
          </div>

          <Field label="Skills" htmlFor="skills" hint="Separate with commas.">
            <input
              id="skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="What skills do you bring? (e.g., Programming, Math, Design)"
              className="input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" htmlFor="location">
              {sel("location", "Select your city", ["Addis Ababa", "Dire Dawa", "Mekelle", "Bahir Dar", "Hawassa", "Gondar", "Adama", "Jimma", "Harar", "Dessie", "Shashemene"])}
            </Field>
            <Field label="Social or portfolio link" htmlFor="socialLinks">
              <input
                id="socialLinks"
                type="text"
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleChange}
                placeholder="LinkedIn, Twitter, or portfolio link"
                className="input"
              />
            </Field>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Payout details</p>
            <p className="mt-0.5 text-xs text-slate-500">Where your 80% share is sent each month.</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Bank" htmlFor="bankType">
                {sel("bankType", "Choose your bank", ["Awash Bank", "Commercial Bank of Ethiopia", "Dashen Bank", "Bank of Abyssinia"])}
              </Field>
              <Field label="Account number" htmlFor="bankAccount">
                <input
                  id="bankAccount"
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="e.g. 100012345678"
                  className="input"
                />
              </Field>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Create creator profile"}
          </button>
        </form>
      </Card>
    </StudioShell>
  );
};

export default CreatorRegistrationForm;
