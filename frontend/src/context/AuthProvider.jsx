import { createContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Base URL
  const serverApi = "http://localhost:5000";

  // ✅ Fetch user profile from DB
  const { data: profile } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/users/${user?.email}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!user?.email,
  });

  const role = profile?.role;

  // --------------------------------------------------------------------
  // ✅ REGISTER (via MongoDB backend)
  // --------------------------------------------------------------------
  const register = async (name, email, password, photoURL = "") => {
    setLoading(true);

    const res = await fetch(`${serverApi}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, photoURL }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      throw new Error(data.error || "Registration failed");
    }

    setUser(data.user); // store logged-in user

    setLoading(false);
    return data.user;
  };

  // --------------------------------------------------------------------
  // ✅ LOGIN (via MongoDB backend)
  // --------------------------------------------------------------------
  const login = async (email, password) => {
    setLoading(true);

    const res = await fetch(`${serverApi}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user); // store logged-in user
    setLoading(false);
    return data.user;
  };

  // --------------------------------------------------------------------
  // ✅ LOGOUT — remove saved user
  // --------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // --------------------------------------------------------------------
  // ✅ Load user from localStorage when page refreshes
  // --------------------------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Save user when changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // --------------------------------------------------------------------

  return (
    <AuthContext.Provider value={{
      profile,
      user,
      role,
      loading,
      register,
      login,
      logout,
      serverApi
    }}>
      {children}
    </AuthContext.Provider>
  );
}
