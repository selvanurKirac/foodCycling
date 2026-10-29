import React, { useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import SignUpUser from "./SignUpUser";
import SignUpRestaurant from "./SignUpRestaurant";
import { AuthContext } from "../context/AuthContext";
import "../assets/css/SignUp.css"

function SignUp() {
    const [activeForm, setActiveForm] = useState("user"); // "user" veya "restaurant"
    const { user } = useContext(AuthContext); // AuthContext'ten kullanıcıyı al
    const navigate = useNavigate();

  
    useEffect(() => {
        console.log(user);
        if (user) {
          if (user.role === "user") {
            navigate("/user");
          } else if (user.role === "restaurant") {
            navigate(`/restaurants/${user.restaurant_id}`);
          } 
        }
      }, [user, navigate]);
    

    return (
        <div className="signup-container">
            <div className="role-selector">
                <button
                    className={activeForm === "user" ? "active" : ""}
                    onClick={() => setActiveForm("user")}
                >
                    User
                </button>
                <button
                    className={activeForm === "restaurant" ? "active" : ""}
                    onClick={() => setActiveForm("restaurant")}
                >
                    Restaurant
                </button>
                <div
                    className="slider"
                    style={{
                        transform: activeForm === "user" ? "translateX(0)" : "translateX(100%)",
                    }}
                ></div>
            </div>

            {activeForm === "user" ? (
                <SignUpUser  />
            ) : (
                <SignUpRestaurant  />
            )}
        </div>
    );
}

export default SignUp;
