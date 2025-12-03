import { createContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase.config";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(true);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch donor profile
  const { data: profile } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await fetch(`${serverApi}/api/users/${user?.email}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!user?.email,
  });

  const role=profile?.role

  // Register user with profile update
  const register = async (email, password, name, photoURL) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (name || photoURL) {
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || ""
      });
    }
    return result;
  };

  // Login user
  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout user
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //Server api
  const localServer= "http://localhost:3000"
  const vercelServer= "https://b11a12-server-side-rabbanictgbd.vercel.app"
  // const serverApi= localServer
  const serverApi= vercelServer

  return (
    <AuthContext.Provider value={{ profile, user, role, loading, register, login, logout, serverApi }}>
      {children}
    </AuthContext.Provider>
  );
}
