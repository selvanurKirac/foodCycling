import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Firestore yapılandırması
import { AuthContext } from "../context/AuthContext";

function MyProducts() {
  const { user } = useContext(AuthContext); // Mevcut kullanıcıyı AuthContext'ten alıyoruz.
  const [products, setProducts] = useState([]); // Ürünleri tutmak için bir state oluşturuyoruz.
  const [loading, setLoading] = useState(true); // Yükleme durumunu tutmak için bir state oluşturuyoruz.

  useEffect(() => {
    if (!user) {
      console.error("Kullanıcı kimliği bulunamadı");
      setLoading(false);
      return;
    }

    // Firestore'un real-time listener özelliğiyle ürünleri takip et.
    const q = query(
      collection(db, "products"),
      where("restaurantId", "==", user.restaurant_id) // Kullanıcıya ait restaurantId'yi filtreliyoruz.
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedProducts = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((product) => product.status === "available"); // Sadece status: "available" olanları filtreliyoruz.

      setProducts(updatedProducts); // Güncel ürün listesini kaydediyoruz.
      setLoading(false); // Yükleme durumunu false yapıyoruz.
    });

    // Component unmount olduğunda listener'ı kapatıyoruz.
    return () => unsubscribe();
  }, [user]); // User değiştiğinde useEffect tekrar çalışır.

  if (loading) {
    return <p>Yükleniyor...</p>; // Yüklenme durumu true ise "Yükleniyor..." yazısı gösteriyoruz.
  }

  return (
    <div style={{ padding: "20px" }}>
    <h1>Ürünlerim</h1>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "#333",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.food_name}
          </h3>
          <p
            style={{
              marginBottom: "10px",
              color: "#555",
              maxHeight: "60px", // Fixed height for description
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3, // Limit to 3 lines
              WebkitBoxOrient: "vertical",
              wordWrap: "break-word",
            }}
          >
            {product.description}
          </p>
          <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#666" }}>
            Kategori: <span style={{ fontWeight: "normal" }}>{product.category_id}</span>
          </p>
          <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#666" }}>
            Stok: <span style={{ fontWeight: "normal" }}>{product.stock}</span>
          </p>
          <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#666" }}>
            Son Tüketim Tarihi: <span style={{ fontWeight: "normal" }}>{product.expire_date}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
  );
}

export default MyProducts;
