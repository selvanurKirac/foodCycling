import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firebase config
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
 
const CategoryPage = () => {
  const { category } = useParams(); // Extract the dynamic route parameter
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get user details from AuthContext
 
  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
 
      // Create base query for fetching products
      let q = query(
        collection(db, "products"),
        where("category_id", "==", category) // Match category
      );
 
      // If the user is a restaurant, add additional filter for restaurant_id
      if (user?.role === "restaurant") {
       
        q = query(
          q,
          where("restaurantId", "==", user.restaurant_id) // Match restaurant_id
        );
      }
 
      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to 00:00
 
          const fetchedProducts = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
              const product = { id: docSnapshot.id, ...docSnapshot.data() };
              console.log(product);
 
              const foodDate = new Date(product.food_date);
              const expireDate = new Date(product.expire_date);
 
              foodDate.setHours(0, 0, 0, 0); // Reset time
              expireDate.setHours(0, 0, 0, 0); // Reset time
 
              // Check if food_date <= expire_date and update category_id
              if (foodDate < today) {
                product.category_id = "hayvanlar";
                await setDoc(
                  doc(db, "products", product.id),
                  { category_id: "hayvanlar" },
                  { merge: true }
                );
              }
 
              // Check if expire_date < today and update status
              if (expireDate < today) {
                product.status = "expired";
                await setDoc(
                  doc(db, "products", product.id),
                  { status: "expired" },
                  { merge: true }
                );
              }
 
              return product;
            })
          );
 
          // Filter out unavailable or expired products
          const validProducts = fetchedProducts.filter(
            (product) => product.status !== "expired" && product.status !== "unavailable"
          );
 
          setProducts(validProducts);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      );
 
      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    };
 
    fetchProducts();
  }, [category, user]);
 
  if (loading) return <p>Loading...</p>;
 
  if (products.length === 0) return <p>No products available in this category.</p>;
 
  return (
    <div>
    <h1>{category.toUpperCase()}</h1>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}
    >
      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            overflow: 'hidden', // Prevent content overflow
            textOverflow: 'ellipsis', // Add ellipsis for overflowing text
            whiteSpace: 'normal', // Allow line breaks
            wordWrap: 'break-word', // Ensure long words break properly
          }}
        >
          <h1
            style={{
              fontSize: '1.2rem',
              marginBottom: '10px',
              wordWrap: 'break-word',
            }}
          >
            {product.food_name}
          </h1>
          <p
            style={{
              maxHeight: '60px', // Set a fixed height for the description
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Truncate with ellipsis
              wordWrap: 'break-word',
            }}
          >
            {product.description}
          </p>

          <p>
            <strong>Kategori:</strong> {product.category_id}
          </p>
          <p>
            <strong>Stok:</strong> {product.stock}
          </p>
          <p>
            <strong>Son Tüketim Tarihi:</strong> {product.food_date}
          </p>

          <Link
            to={`/products/${product.food_id}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#007BFF',
              color: '#fff',
              padding: '10px 15px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Detaylı Göster
          </Link>
        </div>
      ))}
    </div>
  </div>
  );
};
 
export default CategoryPage;