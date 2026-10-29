import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login"; // Login bileşenini eklemeyi unutmayın
import User from "./components/User";
import Restaurant from "./components/Restaurant";
import ProductAdd from "./components/ProductAdd";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import Contact from "./components/Contact.jsx";
import SingleProduct from "./components/SingleProduct.jsx";
import MyReservations from "./components/MyReservations.jsx";
import ReservationInfo from "./components/ReservationInfo.jsx";
import CategoryPage from "./components/CategoryPage.jsx";

 
function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<User/>} />
                <Route path="/restaurants/:restaurantId" element={<Restaurant />} />
                <Route path="/restaurants/:restaurantId/add-product" element={<ProductAdd />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products/:productId" element={<SingleProduct />} />
                <Route path="/:userId/my_reservations" element={<MyReservations />} />
                <Route path="/:userId/reservation_info" element={<ReservationInfo />} />
                <Route path="/:category" element={<CategoryPage />} />

                
            </Routes>
        </Router>
        </AuthProvider>
    );
}
 
export default App;