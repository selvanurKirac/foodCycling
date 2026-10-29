import React, { useState, useEffect, useContext } from "react";  
import { auth } from "../firebase";  
import { signInWithEmailAndPassword } from "firebase/auth";  
import { useNavigate } from "react-router-dom";  
import { AuthContext } from "../context/AuthContext";  
import "../assets/css/Login.css";

function Login() {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [error, setError] = useState(null);  
  const { user, loading } = useContext(AuthContext);  
  const navigate = useNavigate();  

  // Redirect if the user is already logged in  
  useEffect(() => {  
    if (user) {  
      if (user.role === "user") {  
        navigate("/user");  
      } else if (user.role === "restaurant") {  
        navigate(`/restaurants/${user.restaurant_id}`);  
      }  
    }  
  }, [user, navigate]);  

  const handleLogin = async (e) => {  
    e.preventDefault();  
    setError(null);  
    try {  
      await signInWithEmailAndPassword(auth, email, password);  
    } catch (error) {  
      console.error("Error during login:", error);  
      setError(error.message);  
    }  
  };  

  if (loading) {  
    return <div>Loading...</div>; // Loading screen  
  }  

  return (  
    <div className="login-container">  
      <h1>Login</h1>  
      <form className="login-form" onSubmit={handleLogin}>  
        <div className="form-group">  
          <label>Email:</label>  
          <input  
            type="email"  
            value={email}  
            onChange={(e) => setEmail(e.target.value)}  
            required  
          />  
        </div>  
        <div className="form-group">  
          <label>Password:</label>  
          <input  
            type="password"  
            value={password}  
            onChange={(e) => setPassword(e.target.value)}  
            required  
          />  
        </div>  
        {error && <p className="error-message">{error}</p>}  
        <button type="submit" className="login-button">  
          Login  
        </button>
        <button  
        className="home-button"
        style={{backgroundColor:"#17A2B8"}}  
        onClick={() => navigate("/signup")}>  
         Register as a new user  
      </button> 
        <button  
        className="home-button"  
        onClick={() => navigate("/")}>  
         Home  
      </button>   
      </form>  
    </div>  
  );  
}  

export default Login;