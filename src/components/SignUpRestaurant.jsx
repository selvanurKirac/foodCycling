import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../assets/css/RestaurantSignUp.css"

function SignUpRestaurant() {
    const [formData, setFormData] = useState({
        restaurant_name: "",
        email: "",
        phone_number: "",
        password: "",
        address: "",
        opening_hours: "",
        owner_name: "",
        owner_surname: "",
    });

    const [loading, setLoading] = useState(false);  // Yükleniyor durumu
    const [error, setError] = useState("");  // Hata durumu
    const navigate = useNavigate();

    // Form inputlarını işlemek için
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // E-posta, şifre ve telefon numarası doğrulaması
    const validateForm = () => {
        if (!formData.email || !formData.password) {
            return "Email and password are required.";
        }

        // E-posta doğrulaması (basit bir regex kullanıyoruz)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Please enter a valid email address.";
        }

        // Şifre doğrulaması (en az 6 karakter)
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }

        // Telefon numarası doğrulaması
        const phoneRegex = /^(\+90)?(\d{10})$/;  // Türkiye için basit telefon numarası regex
        if (!phoneRegex.test(formData.phone_number)) {
            return "Please enter a valid phone number (e.g. +90 5XX XXX XX XX).";
        }

        return null;
    };

    // Kullanıcı kaydı işlemi
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        const formError = validateForm();
        if (formError) {
            setError(formError);
            return;
        }

        setLoading(true);  // Loading durumunu başlat
        setError("");  // Hata mesajını sıfırla

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const userId = userCredential.user.uid;

            // Firestore'a restaurant kaydını ekle
            await setDoc(doc(db, "restaurants", userId), {
                restaurant_id: userId,
                restaurant_name: formData.restaurant_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address,
                opening_hours: formData.opening_hours,
                owner_name: formData.owner_name,
                owner_surname: formData.owner_surname,
                registration_date: new Date(),
                role: "restaurant",
            });

            alert("Restaurant registration successful!");
            
        } catch (error) {
            console.error("Error during restaurant sign-up:", error);

            // Firebase error handling
            if (error.code === "auth/email-already-in-use") {
                setError("This email is already associated with another account. Please try using a different email.");
            } else {
                setError("Failed to register restaurant. Please try again.");
            }
        } finally {
            setLoading(false);  // Yükleniyor durumunu sonlandır
        }
    };
    const goToHome = () => {
        navigate("/");
    };

    return (
        <form className="form-container" onSubmit={handleSignUp}>
            <h1>Restaurant Sign Up</h1>

            {/* Hata mesajı */}
            {error && <div className="error-message">{error}</div>}
            
            <input
                type="text"
                name="restaurant_name"
                placeholder="Restaurant Name"
                value={formData.restaurant_name}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="opening_hours"
                placeholder="Opening Hours"
                value={formData.opening_hours}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="owner_name"
                placeholder="Owner Name"
                value={formData.owner_name}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="owner_surname"
                placeholder="Owner Surname"
                value={formData.owner_surname}
                onChange={handleInputChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
            />
            
            {/* Yükleniyor durumu */}
            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up as Restaurant"}
            </button>
            <button
                type="button"
                className="home-button"
                onClick={goToHome}
            >
                Home
            </button>
        </form>
    );
}

export default SignUpRestaurant;
