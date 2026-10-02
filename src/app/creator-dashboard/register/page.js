"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Mail, Phone, MapPin, GraduationCap, Briefcase, Landmark, ArrowRight, Camera } from "lucide-react";
import StudioShell, { Card, Field, StudioLoading, maskAccount } from "@/components/studio/StudioShell";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerCreator, updateCreator } from "@/lib/api";
import useCheckCreator from "@/hooks/userCheckMiddleware";
import axios from "axios";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const CreatorRegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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
    }
    setIsLoading(false); // Mark loading as complete
  }, []);

  const educationLevels = ["High School", "Bachelor", "Master", "PhD", "Other"];

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
    if (!isLoading) {
      console.log(userData);
      if (!userData?.userId) {
        router.push(`${appUrl}/auth/login`);
      } else if (userData.role !== "creator") {
        router.push("/"); // Redirect to homepage if not a creator
      }
    }
  }, [userData, isLoading, router]);

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
        socialLinks: JSON.stringify({ telegram: "t.me" }), // Convert object to JSON string
        bankType: creator.bankType || "",
        bankAccount: creator.bankAccount || "",
      });
    }
  }, [creator, userData]); // Add 'userData' as a dependency

  useEffect(() => {
    console.log("Creator:", creator);
    console.log("Loading:", loading);

    if (!loading && (creator === null || creator === undefined)) {
      console.log("Redirecting to /creator-dashboard/notRegisterd");
      router.push("/creator-dashboard/notRegisterd");
    }
  }, [creator, loading, router]);

  if (loading)
    return (
      <StudioShell title="Creator profile">
        <StudioLoading />
      </StudioShell>
    );

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
    setSuccess("");
    setErrors({});

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
        setSuccess(
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
      setErrors({ general: "Please select a file to upload." });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profilePicture", formData.profilePicture);

      const response = await axios.put(
        `${apiUrl}/api/creator/creators/${creator.userId}/picture`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess("Profile picture updated successfully!");
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

  const details = creator
    ? [
        { icon: Mail, label: "Email", value: userData?.gmail },
        { icon: Phone, label: "Phone", value: userData?.phoneNumber },
        { icon: GraduationCap, label: "Education", value: creator.educationLevel },
        { icon: Briefcase, label: "Experience", value: creator.experience && `${creator.experience} years` },
        { icon: MapPin, label: "Location", value: creator.location },
        { icon: Landmark, label: "Payout account", value: `${creator.bankType || "—"} · ${maskAccount(creator.bankAccount)}` },
      ]
    : [];
  const skills = creator?.skills?.split(",").map((x) => x.trim()).filter(Boolean) || [];

  return (
    <StudioShell
      title={creator ? "Creator profile" : "Creator registration"}
      subtitle={
        creator
          ? "This is what learners see on your course pages."
          : "Tell learners who you are and where to send your earnings."
      }
      actions={
        !isEditing && creator ? (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              <Pencil size={16} /> Edit profile
            </button>
            <Link href="/creator-dashboard" className="btn-primary">
              Go to dashboard <ArrowRight size={16} />
            </Link>
          </>
        ) : null
      }
    >
      {errors.general && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.general}</p>
      )}
      {success && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
      )}

      {!isEditing && creator ? (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <Card className="flex flex-col items-center text-center">
            {creator.profilePicture ? (
              <Image
                src={`${creator.profilePicture}`}
                alt="Profile"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-50"
                unoptimized
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">
                No image
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-slate-900">{userData?.name}</h2>
            <p className="mt-1 text-sm text-slate-500">DaguLearn creator</p>
            {!creator.profilePicture && (
              <button onClick={() => setIsEditing(true)} className="mt-3 text-sm font-semibold text-brand-700 hover:underline">
                Add a profile picture
              </button>
            )}
          </Card>

          <div className="space-y-6">
            <Card>
              <p className="eyebrow">About</p>
              <p className="mt-3 leading-relaxed text-slate-700">{creator.bio || "No bio yet."}</p>
              {skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <p className="eyebrow">Details</p>
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="truncate text-sm font-semibold text-slate-900">{value || "—"}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          {/* Profile Picture Section */}
          <Card className="h-fit">
            <h3 className="font-bold text-slate-900">Profile picture</h3>
            <p className="mt-1 text-xs text-slate-500">JPG or PNG, 1MB max.</p>
            <div className="mt-5 flex flex-col items-center gap-4">
              {formData?.profilePicture ? (
                <Image
                  src={
                    typeof formData.profilePicture === "string"
                      ? formData.profilePicture
                      : URL.createObjectURL(formData.profilePicture)
                  }
                  alt="Profile Preview"
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-50"
                  width={128}
                  height={128}
                  unoptimized
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Camera size={28} />
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              />
              <button
                type="button"
                onClick={handleUpdateProfilePicture}
                className="btn-secondary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading…" : "Update profile picture"}
              </button>
            </div>
          </Card>

          {/* Profile Information Section */}
          <Card>
            <h3 className="font-bold text-slate-900">Profile information</h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name">
                  <input id="name" type="text" name="name" value={formData?.name || ""} onChange={handleChange} placeholder={userData?.name} className="input" />
                </Field>
                <Field label="Phone number" htmlFor="phoneNumber">
                  <input id="phoneNumber" type="text" name="phoneNumber" value={userData?.phoneNumber || ""} onChange={handleChange} placeholder={userData?.phoneNumber} className="input bg-slate-50" />
                </Field>
              </div>
              <Field label="Gmail" htmlFor="gmail">
                <input id="gmail" type="text" name="gmail" value={formData?.gmail || ""} onChange={handleChange} placeholder={userData?.gmail} className="input" />
              </Field>
              <Field label="Bio" htmlFor="bio" hint="Shown on your course pages.">
                <textarea id="bio" name="bio" rows={4} value={formData?.bio || ""} onChange={handleChange} placeholder="Tell us about yourself" className="input" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Education level" htmlFor="educationLevel">
                  <select id="educationLevel" name="educationLevel" value={formData?.educationLevel || ""} onChange={handleChange} className="input">
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Experience (years)" htmlFor="experience">
                  <input id="experience" type="text" name="experience" value={formData?.experience || ""} onChange={handleChange} placeholder="Experience" className="input" />
                </Field>
              </div>
              <Field label="Skills" htmlFor="skills" hint="Separate with commas.">
                <input id="skills" type="text" name="skills" value={formData?.skills || ""} onChange={handleChange} placeholder="Skills" className="input" />
              </Field>
              <Field label="Location" htmlFor="location">
                <input id="location" type="text" name="location" value={formData?.location || ""} onChange={handleChange} placeholder="Location" className="input" />
              </Field>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Payout details</p>
                <p className="mt-0.5 text-xs text-slate-500">Where your 80% share is sent each month.</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Field label="Bank" htmlFor="bankType">
                    <select id="bankType" name="bankType" value={formData?.bankType || ""} onChange={handleChange} className="input">
                      <option value="">Select your bank</option>
                      {banksInEthiopia.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Account number" htmlFor="bankAccount">
                    <input id="bankAccount" type="text" name="bankAccount" value={formData?.bankAccount || ""} onChange={handleChange} placeholder="Bank Account Number" className="input" />
                  </Field>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save profile"}
                </button>
                {creator && (
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                )}
                <Link href="/creator-dashboard" className="btn-secondary">
                  Go to creator dashboard
                </Link>
              </div>
            </form>
          </Card>
        </div>
      )}
    </StudioShell>
  );
};

export default CreatorRegistrationForm;
