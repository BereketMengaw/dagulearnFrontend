export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload
    return payload; // Return the decoded payload
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
