"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Eye, EyeOff, GraduationCap, Clapperboard } from "lucide-react";
import Image from "next/image";
import favicon from "../../../public/favicon.png";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Lets a "Sign up" button open the popup on the signup tab.
export const authTabHint = { next: "login" };

const AuthPage = ({ onClose }) => {
  const [tab] = useState(() => {
    const t = authTabHint.next;
    authTabHint.next = "login";
    return t;
  });
  const [submitting, setSubmitting] = useState(false);
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
    setErrorMessage("");
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
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

    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const PasswordToggle = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  const PhoneField = ({ id, value, onChange }) => (
    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15">
      <span className="flex shrink-0 items-center whitespace-nowrap border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">
        🇪🇹 +251
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="9XXXXXXXX"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        required
      />
    </div>
  );

  const label = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <Image src={favicon} alt="" width={40} height={40} className="mb-3 h-10 w-10" />
          <h2 className="text-xl font-bold text-slate-900">Welcome to DaguLearn</h2>
          <p className="mt-1 text-sm text-slate-500">
            Learn from Ethiopian creators. Pay securely with Chapa.
          </p>
        </div>

        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
            <TabsTrigger value="login" className="rounded-lg text-sm font-semibold">
              Log in
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg text-sm font-semibold">
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className={label}>
                  Phone number
                </label>
                {PhoneField({
                  id: "phoneNumber",
                  value: phoneNumber,
                  onChange: (e) => {
                    const input = e.target.value.replace(/\D/g, "");
                    if (input.length <= 9) setPhoneNumber(input);
                  },
                })}
              </div>

              <div>
                <label htmlFor="password" className={label}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-11"
                    required
                  />
                  <PasswordToggle />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Logging in…" : "Log in"}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <span className={label}>I want to</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "student", title: "Learn", icon: GraduationCap },
                    { value: "creator", title: "Teach", icon: Clapperboard },
                  ].map(({ value, title, icon: Icon }) => {
                    const active = formData.role === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: value }))
                        }
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "border-brand-500 bg-brand-50 text-brand-800 ring-4 ring-brand-500/10"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={18} className={active ? "text-brand-600" : "text-slate-400"} />
                        <span>
                          <span className="block font-semibold">{title}</span>
                          <span className="block text-xs text-slate-500">
                            {value === "student" ? "Student" : "Creator"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="signup-name" className={label}>
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleSignupChange}
                  className="input"
                  placeholder="e.g. Abebe Kebede"
                />
              </div>

              <div>
                <label htmlFor="signup-gmail" className={label}>
                  Gmail
                </label>
                <input
                  id="signup-gmail"
                  type="email"
                  name="gmail"
                  autoComplete="email"
                  value={formData.gmail}
                  onChange={handleSignupChange}
                  className="input"
                  placeholder="you@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="signup-phone" className={label}>
                  Phone number
                </label>
                {PhoneField({
                  id: "signup-phone",
                  value: formData.phoneNumber.replace("+251", ""),
                  onChange: (e) => {
                    const input = e.target.value.replace(/\D/g, "");
                    if (input.length <= 9) {
                      setFormData((prevData) => ({
                        ...prevData,
                        phoneNumber: `+251${input}`,
                      }));
                    }
                  },
                })}
              </div>

              <div>
                <label htmlFor="signup-password" className={label}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleSignupChange}
                    className="input pr-11"
                    placeholder="Create a password"
                    required
                  />
                  <PasswordToggle />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
