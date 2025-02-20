import jwtDecode from "jwt-decode";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useAuth = () => {
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return { isLoggedIn, logout };
};
