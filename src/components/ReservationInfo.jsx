import React, { useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import "../assets/css/ReservationInfo.css"; // CSS dosyası import edildi
import Navbar from "./Navbar";

const ReservationInfo = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("all");
  const [reservations, setReservations] = useState({
    all: [],
    next: [],
    cancelled: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);

  const markAsCompleted = async (reservationId) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      await updateDoc(reservationRef, { status: "completed" });
      alert("Reservation marked as completed.");
    } catch (error) {
      console.error("Error marking reservation as completed:", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "restaurant") return;
  
    const filters = [];
    if (activeTab === "all") {
      filters.push(where("restaurantId", "==", user.restaurant_id));
    } else {
      filters.push(
        where("restaurantId", "==", user.restaurant_id),
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
        
        // Sadece ilgili sekmeyi güncelle
        setReservations((prev) => ({
          ...prev,
          [activeTab]: data, // Sadece aktif sekmenin verilerini değiştir
        }));
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
    <>
    <Navbar />
    <div className="reservation-container">
      <h1 className="reservation-title">Reservations for Restaurant</h1>
      <div className="tab-buttons">
        <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          Hepsi
        </button>
        <button className={`tab-btn ${activeTab === "next" ? "active" : ""}`} onClick={() => setActiveTab("next")}>
          Sonraki Aşama
        </button>
        <button className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`} onClick={() => setActiveTab("cancelled")}>
          İptal edilenler
        </button>
        <button className={`tab-btn ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
          Tamamlananlar
        </button>
      </div>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : reservations[activeTab].length === 0 ? (
        <p className="no-data-text">No reservations found.</p>
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Reservasyon ID</th>
              <th>Yemek Adı</th>
              <th>Miktar</th>
              <th>Durumu</th>
              {activeTab === "next" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reservations[activeTab].map((reservation) => (
              <tr key={reservation.reservation_id}>
                <td>{reservation.reservation_id}</td>
                <td>{reservation.food_name}</td>
                <td>{reservation.quantity}</td>
                <td>{reservation.status}</td>
                {activeTab === "next" && (
                  <td>
                    <button className="complete-btn" onClick={() => markAsCompleted(reservation.reservation_id)}>
                      Onayla
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};

export default ReservationInfo;
