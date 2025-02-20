// formValidation.js
export const validateForm = (formData) => {
  let formErrors = {};
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!formData.name) formErrors.name = "Name is required.";
  if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber))
    formErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
  if (!formData.gmail || !emailRegex.test(formData.gmail))
    formErrors.gmail = "Please enter a valid Gmail address.";
  if (!formData.password) formErrors.password = "Password is required.";
  if (!formData.bio) formErrors.bio = "Bio is required.";
  if (!formData.educationLevel)
    formErrors.educationLevel = "Education Level is required.";
  if (!formData.experience) formErrors.experience = "Experience is required.";
  if (!formData.skills) formErrors.skills = "Skills are required.";
  if (!formData.location) formErrors.location = "Location is required.";
  if (!formData.bankAccount)
    formErrors.bankAccount = "Bank Account number is required.";

  return formErrors;
};
