import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
 
const Navbar = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  const handleReservationsClick = () => {
    navigate(`/${user.user_id}/my_reservations`);
  };
 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
 
  const handleDropdownChange = (value) => {
    switch (value) {
     
      case "reservations":
        handleReservationsClick();
        break;
      case "my-products":
        navigate("/");
        break;
      case "reservation-info":
        navigate(`/${user.restaurant_id}/reservation_info`);
        break;
      default:
        navigate(`/${value}`);
    }
    setIsDropdownOpen(false);
  };
 
  const turkishMap = {
    "ç": "c",
    "ğ": "g",
    "ı": "i",
    "ö": "o",
    "ş": "s",
    "ü": "u"
  };
 
  const turkishToEnglish = (str) => {
    return str.replace(/[çğışöü]/g, (char) => turkishMap[char] || char);
  };
 
  const commonMenuItems = [
    "Ana Yemek",
    "Salata",
    "Çorba",
    "Fast Food",
    "Kahvaltı",
    "Meyveler",
    "İçecekler",
    "Tatlılar",
    "Makarna Ve Pilav",
    "Mezeler",
    "Ekmek",
    "Kuruyemiş",
    "Hayvanlar",
  ].map((item) => (
    <option
      key={item}
      value={turkishToEnglish(item.toLowerCase().replaceAll(" ", "_"))}
    >
      {item}
    </option>
  ));
 
 
  const renderDropdown = () => {
    if (!user) return commonMenuItems;
 
    if (user.role === "user") {
      return [
        ...commonMenuItems,
        <option key="reservations" value="reservations">Rezervasyonlarım</option>,
      ];
    }
 
    if (user.role === "restaurant") {
      return [
        ...commonMenuItems,
        <option key="my-products" value="my-products">Ürünlerim</option>,
        <option key="reservation-info" value="reservation-info">Rezervasyon Bilgileri</option>,
      ];
    }
 
    return commonMenuItems;
  };
 
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        backgroundColor: "#2a4365",
        color: "#f7fafc",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={() => navigate("/")} style={{ border: "none", background: "none", cursor: "pointer" }}>
          <img src="/favicon.png" alt="Home" style={{ width: "40px", height: "40px" }} />
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link
          to="/contact"
          style={{ color: "#f7fafc", textDecoration: "none", fontSize: "16px", marginRight: "10px" }}
        >
          Contact
        </Link>
        {!user ? (
          <div style={{ display: "flex", gap: "15px" }}>
            <Link
              to="/login"
              style={{
                color: "#1a202c",
                background: "#f7fafc",
                padding: "8px 15px",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "14px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#edf2f7")}
              onMouseOut={(e) => (e.target.style.background = "#f7fafc")}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                color: "#1a202c",
                background: "#f7fafc",
                padding: "8px 15px",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "14px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#edf2f7")}
              onMouseOut={(e) => (e.target.style.background = "#f7fafc")}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              color: "#f7fafc",
              background: "#4a5568",
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2d3748")}
            onMouseOut={(e) => (e.target.style.background = "#4a5568")}
          >
            Logout
          </button>
        )}
        {!loading && (
          <select
            onChange={(e) => handleDropdownChange(e.target.value)}
            style={{
              color: "#1a202c",
              background: "#f7fafc",
              border: "1px solid #ccc",
              padding: "8px 10px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
            defaultValue="default"
          >
            <option value="default" disabled>
              Menü Seçin
            </option>
            {renderDropdown()}
          </select>
        )}
      </div>
    </nav>
  );
};
 
export default Navbar;