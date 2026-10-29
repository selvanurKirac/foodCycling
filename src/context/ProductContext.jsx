// Firestore'den bir ürünü id'sine göre getirme
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import React, { createContext, useContext, useState } from "react";


// ProductContext oluşturma
const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductById = async (productId) => {
    try {
      setLoading(true);
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct(productSnap.data());
        return productSnap.data();
      } else {
        console.log("No such product found!");
        setProduct(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ product, fetchProductById, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

