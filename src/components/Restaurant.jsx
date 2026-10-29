import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MyProducts from "./MyProducts";
import Navbar from "./Navbar";

function RestaurantPage() {
  const { user, loading } = useContext(AuthContext); // AuthContext'ten kullanıcı bilgilerini alıyoruz.
  const navigate = useNavigate();

  // Kullanıcı bilgileri yükleniyorsa bekleme mesajı
  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  // Kullanıcı yetkili değilse erişim engeli
  if (!user || user.role !== "restaurant") {
    return <p>Bu sayfaya erişim izniniz yok.</p>;
  }
  console.log(user);

  const handleAddProduct = () => {
    navigate(`/restaurants/${user.restaurant_id}/add-product`); // Kullanıcıyı ürün ekleme sayfasına yönlendiriyoruz.
  };

  return (
    <>
    <Navbar />
    
    <div style={{ padding: "20px" }}>
      
      <h1>{user.restaurantName}</h1> {/* Restoranın adı kullanıcıya gösteriliyor */}
      <button
        onClick={handleAddProduct}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Ürün Ekle
      </button>
      <div>
        <MyProducts />
        
      </div>
    </div>
    </>
  );
}

export default RestaurantPage;
