import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const COLLEGE_DOMAIN = "@pragati.ac.in";

export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

/* ───── Listen for Firebase login state ───── */

useEffect(() => {


const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

  if (firebaseUser) {

    setUser(firebaseUser);

    try {

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        setProfile({
          uid: firebaseUser.uid,
          name: data.name || "",
          email: data.email || firebaseUser.email,
          role: data.role || "student",
          branch: data.branch || "",
          semester: data.semester || 0,
          clubName: data.clubName || "",
          isVerified: data.isVerified ?? true
        });

      } else {

        console.warn("User profile missing in Firestore");
        setProfile(null);

      }

    } catch (err) {

      console.error("Error loading profile:", err);
      setProfile(null);

    }

  } else {

    setUser(null);
    setProfile(null);

  }

  setLoading(false);

});

return () => unsubscribe();


}, []);

/* ───── Logout ───── */

const logout = async () => {


try {
  await signOut(auth);
  setUser(null);
  setProfile(null);
} catch (err) {
  console.error("Logout error:", err);
}


};

/* ───── Update Profile (local state only) ───── */

const updateProfile = (updates) => {


setProfile(prev => ({
  ...prev,
  ...updates
}));


};

const value = {
user,
profile,
loading,
logout,
updateProfile
};

return (
<AuthContext.Provider value={value}>
{!loading && children}
</AuthContext.Provider>
);

};

export const useAuth = () => {

const ctx = useContext(AuthContext);

if (!ctx) {
throw new Error("useAuth must be used within AuthProvider");
}

return ctx;

};
