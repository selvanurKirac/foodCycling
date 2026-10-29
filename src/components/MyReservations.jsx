import React, { useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const MyReservations = () => {

  const [activeTab, setActiveTab] = useState("all");
  const [reservations, setReservations] = useState({
    all: [],
    next: [],
    cancelled: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const cancelReservation = async (reservation_id, food_id) => {
    try {
      // Firestore'daki "reservations" koleksiyonundan rezervasyon dökümanına referans oluştur
      const reservationRef = doc(db, "reservations", reservation_id);
  
      // Rezervasyon detaylarını al
      const reservationSnap = await getDoc(reservationRef);
      if (!reservationSnap.exists()) {
        throw new Error("Reservation not found.");
      }
      const reservationData = reservationSnap.data();
  
      // Ürün miktarını güncellemek için "products" koleksiyonundan ürüne referans oluştur
      const productRef = doc(db, "products", food_id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found.");
      }
      const productData = productSnap.data();
  
      // Yeni miktarı hesapla
      const updatedQuantity = productData.stock + reservationData.quantity;
  
      // Ürün durumunu kontrol et ve gerekirse "available" yap
      const updateData = { stock: updatedQuantity };
      if (productData.stock === 0 && updatedQuantity > 0) {
        updateData.status = "available";
      }
  
      // Ürün durumunu ve miktarı güncelle
      await updateDoc(productRef, updateData);
  
      // Rezervasyon durumunu "cancelled" olarak güncelle
      await updateDoc(reservationRef, { status: "cancelled" });
  
      alert("Reservation cancelled and product quantity updated successfully.");
    } catch (error) {
      console.error("Error cancelling reservation or updating product:", error);
    }
  };
  
  

  useEffect(() => {
    if (!user || (user.role !== "user")) return;
  
    const filters = [];
    if (activeTab === "all") {
      filters.push(where("user_id", "==", user.user_id));
    } else {
      filters.push(
        where("user_id", "==", user.user_id),
        where("status", "==", activeTab)
      );
    }
  
    const q = query(collection(db, "reservations"), ...filters);
  
    setLoading(true); // Yeni sorgu başladığında yükleme durumunu ayarla
  
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Sekme değişimlerini izole ederek sadece aktif sekmeyi güncelle
        setReservations((prev) => {
          const updatedReservations = { ...prev };
          // Aktif olmayan sekmelerin verilerini temizle
          const clearedReservations = Object.keys(updatedReservations).reduce((acc, key) => {
            if (key === activeTab) {
              acc[key] = data;
            } else {
              acc[key] = [];
            }
            return acc;
          }, {});
          return clearedReservations;
        });
  
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
  }, [user, activeTab]);
  



  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Reservations</h1>
      <div style={{ display: "flex", marginBottom: "20px" }}>
      <button
  style={{
    backgroundColor: activeTab === "all" ? "#007bff" : "#f0f0f0",
    color: activeTab === "all" ? "#fff" : "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: activeTab === "all" ? "bold" : "normal",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }}
  onClick={() => setActiveTab("all")}
>
  Hepsi
</button>
<button
  style={{
    backgroundColor: activeTab === "next" ? "#007bff" : "#f0f0f0",
    color: activeTab === "next" ? "#fff" : "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: activeTab === "next" ? "bold" : "normal",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }}
  onClick={() => setActiveTab("next")}
>
  Sonraki aşama
</button>
<button
  style={{
    backgroundColor: activeTab === "cancelled" ? "#007bff" : "#f0f0f0",
    color: activeTab === "cancelled" ? "#fff" : "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: activeTab === "cancelled" ? "bold" : "normal",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }}
  onClick={() => setActiveTab("cancelled")}
>
  İptal edilenler
</button>
<button
  style={{
    backgroundColor: activeTab === "completed" ? "#007bff" : "#f0f0f0",
    color: activeTab === "completed" ? "#fff" : "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: activeTab === "completed" ? "bold" : "normal",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }}
  onClick={() => setActiveTab("completed")}
>
  Tamamlananlar
</button>

      </div>
      <div>
  {loading ? (
    <p>Loading...</p>
  ) : reservations[activeTab].length === 0 ? (
    <p>No reservations found.</p>
  ) : (
    reservations[activeTab].map((reservation) => (
      <div
        key={reservation.reservation_id}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          {reservation.restaurant_name}
        </p>
        <p
  style={{
    fontSize: "16px",
    marginBottom: "5px",
    color: "#555",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  }}
>
  <strong>Yemek adı:</strong> {reservation.food_name}
</p>

        <p style={{ fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          <strong>Miktar:</strong> {reservation.quantity}
        </p>
        <p style={{ fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          <strong>Durumu:</strong>{" "}
          <span
            style={{
              color:
                reservation.status === "cancelled"
                  ? "#ff4d4f"
                  : reservation.status === "completed"
                  ? "#28a745"
                  : "#007bff",
            }}
          >
            {reservation.status}
          </span>
        </p>
        <p style={{ fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          <strong>Son Tüketim Tarihi:</strong> {reservation.food_date}
        </p>
        {reservation.delivery_date && (
          <p style={{ fontSize: "16px", marginBottom: "5px", color: "#555" }}>
            <strong>Delivery Date:</strong> {reservation.delivery_date}
          </p>
        )}
        {activeTab === "next" && (
          <button
            onClick={() =>
              cancelReservation(
                reservation.reservation_id,
                reservation.food_id
              )
            }
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#d9363e")
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
          >
            Reservasyonu iptal et
          </button>
        )}
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default MyReservations;
