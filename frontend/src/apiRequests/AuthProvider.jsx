import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // stores user details (id, email, role)
  const [accessToken, setAccessToken] = useState(null); // short-lived token
  const [loading, setLoading] = useState(true);

  // Try to refresh when app loads
  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch("http://localhost:5500/api/refresh", {
          method: "GET",
          credentials: "include", // send cookies (refresh token)
        });

        const data = await response.json();

        if (response.ok && data.user && data.accessToken) {
          setUser(data.user);              // { id, email, role }
          setAccessToken(data.accessToken); // short-lived token
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (err) {
        console.error("Refresh failed:", err);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // allow refresh cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.accessToken) {
        setUser(data.user);              
        setAccessToken(data.accessToken);
        alert("Login successful");
        return data.user;
      } else {
        alert(data.message || "Login failed");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again later.");
      return null;
    }
  };

  // ✅ Logout
  const logOut = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok || response.status === 204) {
        setUser(null);
        setAccessToken(null);
        alert("Logout successful");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
