import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../assets/css/SingleProduct.css"

 
const SingleProduct = () => {
  const { user } = useContext(AuthContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
 
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          console.error('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchProduct();
  }, [productId]);
 
  // Stock güncellenirse quantity'yi sıfırla
  useEffect(() => {
    if (product) {
      setQuantity(0);
    }
  }, [product]);
 
  const handleReservation = async () => {
    if (!user) {
      alert("Rezervasyon yapmak için giriş yapmanız gerekmektedir.");
      navigate("/login");
      return;
    }
    if (user.role === "restaurant") {
      alert("Restaurantlar rezervasyon yapamaz.");
      navigate("/home");
      return;
    }
   
    try {
      if (quantity <= 0) {
        alert("Lütfen rezervasyon için geçerli bir miktar seçiniz.");
        return;
      }
   
      if (product.stock <= 0 || product.stock < quantity) {
        alert("Yeterli stok bulunmamaktadır. Rezervasyon yapılamadı.");
        return;
      }
   
      const updatedStock = product.stock - quantity;
   
      // Ürün güncellemesi
      const productUpdateData = {
        stock: updatedStock,
        ...(updatedStock <= 0 && { status: "unavailable" }),
      };
   
      // Firestore işlemleri için batched write veya ayrı işlemler
      const reservationCollectionRef = collection(db, "reservations");
      const reservationDoc = await addDoc(reservationCollectionRef, {
        product_id: product.id,
        quantity,
        user_id: user.user_id,
        reservation_id: null, // Daha sonra doldurulacak
        delivery_time: null,
        status: "next",
      });
   
      const reservationId = reservationDoc.id;
   
      // Rezervasyon belgesini güncelle
      await setDoc(doc(db, "reservations", reservationId), {
        ...product,
        reservation_id: reservationId,
        quantity,
        user_id: user.user_id,
        delivery_time: null,
        status: "next",
        stock: updatedStock,
      });
   
      // Ürünü güncelle
      await setDoc(doc(db, "products", product.id), {
        ...product,
        ...productUpdateData,
      });
   
      // Local state güncellemesi
      setProduct((prev) => ({
        ...prev,
        stock: productUpdateData.stock,
        status: productUpdateData.status || prev.status,
      }));
   
      alert(`Rezervasyon başarıyla oluşturuldu! Rezervasyon ID: ${reservationId}`);
    } catch (error) {
      console.error("Rezervasyon hatası:", error);
      alert("Rezervasyon sırasında bir sorun oluştu.");
    }
  };
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
 
  const decreaseQuantity = () => {
    if (quantity >= 1) {
      setQuantity(quantity - 1);
    }
  };
 
  if (loading) {
    return <p>Loading...</p>;
  }
 
  if (!product) {
    return <p>Product not found.</p>;
  }
 
  return (
    <div className="single-product-container">
      <h1 className="single-product-title">{product.food_name}</h1>
      <div className="single-product-quantity">
        <button onClick={decreaseQuantity} disabled={quantity === 0} >-</button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity} disabled={quantity == product.stock} >+</button>
      </div>
      <div className="single-product-details">
      <p> içerik: {product.description}</p>
        <p>
        <strong>Kategori:</strong> {product.category_id}
        </p>
        <p>
          <strong>Stok:</strong> {product.stock} {product.unit}
        </p>
        <p>
          <strong>Son tüketim Tarihi:</strong> {product.food_date}
        </p>
        <p>
          <strong>Bozulma Tarihi(hayvanlar için):</strong> {product.expire_date}
        </p>
       
        <p>
          <strong>Durumu:</strong> {product.status}
        </p>
        <p>
          <strong>Restaurant adı:</strong> {product.restaurant_name}
          {console.log(product)}
        </p>
        <button className="reserve-button" onClick={handleReservation}>Rezervasyon Yap</button>
      </div>
    </div>
  );
};
 
export default SingleProduct;