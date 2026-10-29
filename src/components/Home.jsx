import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import ShowAllProducts from "./ShowAllProducts";
import img1 from "../assets/images/img1.jpg";
import img2 from "../assets/images/img2.jpg";
import img3 from "../assets/images/img3.jpg";
 
function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
 
  useEffect(() => {
    if (user) {
      if (user.role === "user") {
        navigate("/user");
      } else if (user.role === "restaurant") {
        navigate(`/restaurants/${user.restaurant_id}`);
      }
    }
  }, [user, navigate]);
 
  return (
    <div style={{ textAlign: "center" }}>
      <Navbar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px",
          margin:"10px 0"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={img1}
            alt="Sample 1"
            style={{ borderRadius: "15px", width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={img2}
            alt="Sample 2"
            style={{ borderRadius: "15px", width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={img3}
            alt="Sample 3"
            style={{ borderRadius: "15px", width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
      </div>
      <ShowAllProducts />
    </div>
  );
}
 
export default Home;