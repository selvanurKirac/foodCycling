// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        try {
          // 1) RESTAURANT kontrolü
          const restaurantDocRef = doc(db, "restaurants", uid);
          const restaurantDoc = await getDoc(restaurantDocRef);

          if (restaurantDoc.exists()) {
            // Restoran dokümanı varsa...
            const restaurantData = restaurantDoc.data();
            setUser({
              
              ...restaurantData,
            });
          } else {
            // 2) RESTAURANT yoksa USER kontrolü
            const userDocRef = doc(db, "users", uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              // User dokümanı varsa...
              const userData = userDoc.data();
              setUser({
                
                ...userData,
              });
            } else {
              // Ne restaurant ne user dokümanı yoksa...
              setUser({
                
                role: null, // ya da "unknown"
              });
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setUser({
            
            role: null,
          });
        }
      } else {
        // Kullanıcı çıkış yaptıysa
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
