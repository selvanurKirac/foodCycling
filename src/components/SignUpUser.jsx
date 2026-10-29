import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SignUpUser() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
    });
    const [loading, setLoading] = useState(false); // loading state
    const [errorMessage, setErrorMessage] = useState(""); // error message state
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const phoneRegex = /^(\+90)?(\d{10})$/; // Türkiye için telefon numarası regex

        // Basit form doğrulama (email, password, phone number)
        if (!formData.name || !formData.email || !formData.phone_number || !formData.password) {
            setErrorMessage("All fields are required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrorMessage("Please enter a valid email.");
            return false;
        }
        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return false;
        }
        if (!phoneRegex.test(formData.phone_number)) {
            setErrorMessage("Please enter a valid phone number (e.g. +90 5XX XXX XX XX).");
            return false;
        }
        setErrorMessage(""); // Clear error message if validation passes
        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Validate form before submission

        setLoading(true); // Set loading to true when sign-up starts
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const userId = userCredential.user.uid;

            // Add user data to Firestore
            await setDoc(doc(db, "users", userId), {
                user_id: userId,
                user_name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                registration_date: new Date(),
                role: "user",
            });

            alert("User registration successful!");
            
        } catch (error) {
            console.error("Error during user sign-up:", error);
            
            // Handle specific Firebase error: email already in use
            if (error.code === "auth/email-already-in-use") {
                setErrorMessage("This email is already associated with another account. Please try using a different email.");
            } else {
                setErrorMessage("Error during sign-up. Please try again later.");
            }
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
    };

    const goToHome = () => {
        navigate("/");
    };

    return (
        <form className="form-container" onSubmit={handleSignUp}>
            <h1>User Sign Up</h1>

            {/* Error message display */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <input
                type="text"
                name="name"
                placeholder="User Name"
                value={formData.name}
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
            
            {/* Loading button state */}
            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up as User"}
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

export default SignUpUser;
