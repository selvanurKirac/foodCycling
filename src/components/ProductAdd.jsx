import React, { useState, useContext } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function ProductAdd() {
  const { user } = useContext(AuthContext);

  const today = new Date().toISOString().split("T")[0]; // Bugünün tarihi

  const [formData, setFormData] = useState({
    food_name: "",
    description: "",
    category_id: "ana_yemek", // Varsayılan kategori
    stock: "",
    unit: "Porsiyon",
    food_date: today,
    expire_date: today,
    status: "available",
    creation_date: today, // Varsayılan olarak bugünkü tarih
  });

  const turkishMap = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  const turkishToEnglish = (str) =>
    str
      .toLowerCase()
      .replaceAll(" ", "_")
      .replace(/[çğışöü]/g, (char) => turkishMap[char] || char);

  const categories = [
    "Ana yemek",
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
    
  ];

  const units = ["Porsiyon", "Kilogram", "Litre", "Adet"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { creation_date, food_date, expire_date, stock } = formData;
  
    if (new Date(food_date) < new Date(today)) {
      alert("Üretim tarihi bugünden önce olamaz!");
      return;
    }
  
    if (new Date(expire_date) < new Date(food_date)) {
      alert("Son kullanma tarihi, üretim tarihinden önce olamaz!");
      return;
    }
  
    if (!user || !user.restaurant_id) {
      alert("Ürün eklemek için yetkiniz yok.");
      return;
    }
  
    try {
      const productsCollectionRef = collection(db, "products");
      const newProductRef = doc(productsCollectionRef);
      const newProductId = newProductRef.id;
  
      // Stok miktarına göre status belirle
      const adjustedStatus = stock <= 0 ? "unavailable" : formData.status;
  
      await setDoc(newProductRef, {
        ...formData,
        status: adjustedStatus, // Stok miktarına göre güncellenmiş durum
        restaurant_name: user.restaurant_name,
        restaurantId: user.restaurant_id,
        food_id: newProductId,
        creation_date: new Date(creation_date), // Firestore için doğru format
      });
  
      alert("Ürün başarıyla eklendi!");
      setFormData({
        food_name: "",
        description: "",
        category_id: "ana_yemek",
        stock: "",
        unit: "Porsiyon",
        food_date: today,
        expire_date: today,
        status: "available",
        creation_date: today,
      });
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
      alert("Ürün eklenirken bir hata oluştu.");
    }
  };
  

  return (
    <div
  style={{
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    overflowY: "auto",
    maxHeight: "90vh",
  }}
>
  <h1 style={{ textAlign: "center", color: "#333" }}>Ürün Ekle</h1>
  <form
    onSubmit={handleSubmit}
    style={{ display: "flex", flexDirection: "column", gap: "15px" }}
  >
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Yemek Adı:
        </label>
        <input
          type="text"
          name="food_name"
          value={formData.food_name}
          onChange={handleInputChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Stok:
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          required
          min="1"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        Açıklama:
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Kategori:
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {categories.map((category) => (
            <option key={category} value={turkishToEnglish(category)}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Birim:
        </label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          İnsanlar için tarih belirle:
        </label>
        <input
          type="date"
          name="food_date"
          value={formData.food_date}
          onChange={handleInputChange}
          required
          min={today}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={{ flex: "1 1 calc(50% - 10px)", minWidth: "150px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
         hayvanlar için tarih belirle:
        </label>
        <input
          type="date"
          name="expire_date"
          value={formData.expire_date}
          onChange={handleInputChange}
          required
          min={formData.food_date || today}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        Durum:
      </label>
      <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="available">Mevcut</option>
        <option value="unavailable">Mevcut Değil</option>
      </select>
    </div>
    <button
      type="submit"
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
      Ekle
    </button>
  </form>
</div>

  );
}

export default ProductAdd;
