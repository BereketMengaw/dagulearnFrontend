// src/app/utils/auth.js
export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token); // Save the token to localStorage
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token"); // Retrieve the token from localStorage
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token"); // Remove the token from localStorage
  }
};
