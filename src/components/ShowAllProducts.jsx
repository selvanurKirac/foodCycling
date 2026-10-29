import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

const ShowAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"));

    // Firestore real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const allProducts = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((product) => product.status !== 'unavailable'); // Filter out unavailable products

        setProducts(allProducts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    );

    // Cleanup: Remove listener
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div>
      <h1>Bütün Ürünler</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              overflow: 'hidden',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '10px',
                maxHeight: '3.2em', // Restrict to 2 lines
                lineHeight: '1.6em', // Adjust line height
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal', // Allow line breaks
                display: '-webkit-box',
                WebkitLineClamp: 2, // Clamp to 2 lines
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.food_name}
            </h3>
            <p
              style={{
                maxHeight: '60px', // Set a fixed height for the description
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            >
             içerik: {product.description}
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
              Detaylı göster
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAllProducts;
