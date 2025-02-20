import React from "react";

function CreaterRegister() {
  return (
    <div>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Creator Registration
        </h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="text-red-500 text-sm mb-4">{errors.general}</div>
          )}

          {!isConfirming ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="gmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email (Gmail)
                </label>
                <input
                  type="email"
                  id="gmail"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.gmail && (
                  <p className="text-red-500 text-sm">{errors.gmail}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="educationLevel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Education Level
                </label>
                <input
                  type="text"
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.educationLevel && (
                  <p className="text-red-500 text-sm">
                    {errors.educationLevel}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700"
                >
                  Experience
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm">{errors.experience}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm">{errors.skills}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="socialLinks.linkedin"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  id="socialLinks.linkedin"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bankType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankType"
                  name="bankType"
                  value={formData.bankType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.bankType && (
                  <p className="text-red-500 text-sm">{errors.bankType}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="bankAccount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Account
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.bankAccount && (
                  <p className="text-red-500 text-sm">{errors.bankAccount}</p>
                )}
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Please confirm your details before submission.
              </h3>
              <ul className="space-y-2">
                <li>Name: {formData.name}</li>
                <li>Email: {formData.gmail}</li>
                <li>Phone Number: {formData.phoneNumber}</li>
                <li>Bio: {formData.bio}</li>
                <li>Education Level: {formData.educationLevel}</li>
                <li>Experience: {formData.experience}</li>
                <li>Skills: {formData.skills}</li>
                <li>Location: {formData.location}</li>
                <li>LinkedIn: {formData.socialLinks.linkedin}</li>
                <li>Bank Name: {formData.bankType}</li>
                <li>Bank Account: {formData.bankAccount}</li>
              </ul>

              <button
                onClick={handleConfirmSubmit}
                className="w-full mt-4 p-2 bg-green-600 text-white rounded-md"
                disabled={isSubmitting}
              >
                Confirm and Submit
              </button>

              <button
                onClick={handleEdit}
                className="w-full mt-2 p-2 bg-gray-400 text-white rounded-md"
              >
                Edit Details
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreaterRegister;
