// import { createContext, useState, useEffect } from "react";

// // Create context
// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // {email, role, token}
//   const [loading, setLoading] = useState(true);

//   // Simulate getting user from localStorage or API
//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user"));
//     if (savedUser) {
//       setUser(savedUser);
//     }
//     setLoading(false);
//   }, []);

//   // Login function
//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
