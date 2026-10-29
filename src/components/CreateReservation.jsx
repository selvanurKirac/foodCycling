import { collection, addDoc } from "firebase/firestore";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
 
const CreateReservation = ({ product, stock }) => {
  const { user } = useContext(AuthContext); // Kullanıcı bilgisi
  const navigate = useNavigate();
 
  const handleReservation = async () => {
    if (!user) {
      alert("Rezervasyon yapmak için giriş yapmanız gerekmektedir.");
      navigate("/login");
      return;
    }
    if (user.role=="restaurant") {
      alert("restaurantlar rezervasyon yapamaz.");
      navigate("/home");
      return;
    }
 
    
    const reservationData = {
      reservation_id: "",
      user_id: user.user_id,
      food_id: product.food_id,
      reservation_time: new Date(),
      quantity:stock,
      food_date: product.food_date,
      expire_date: product.expire_date,
      status: 0,
      delivery_time: 0,
      restaurant_id:product.restaurant_id
    };
 
    try {
      const docRef = await addDoc(collection(db, "reservations"), reservationData);
      alert(`Rezervasyon başarıyla oluşturuldu! Rezervasyon ID: ${docRef.id}`);
    } catch (error) {
      console.error("Rezervasyon hatası:", error);
      alert("Rezervasyon sırasında bir sorun oluştu.");
    }
  };
 
  return (
    <div
    style={{
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      maxWidth: "300px",
      margin: "auto",
    }}
  >
    <h2
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#2a4365",
        marginBottom: "15px",
      }}
    >
      {product.name}
    </h2>
    <button
      onClick={handleReservation}
      style={{
        all: "unset",
        backgroundColor: "#4a5568",
        color: "#f7fafc",
        border: "none",
        padding:"5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#2d3748")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#4a5568")}
    >
      Rezervasyon Yap
    </button>
  </div>
  );
};
 
export default CreateReservation;