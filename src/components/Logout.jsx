import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Burada logout işlemini gerçekleştirebilirsiniz
    // Örneğin, auth bilgilerini temizleyip ana sayfaya yönlendirebiliriz
    localStorage.removeItem("authToken"); // Eğer token kullanıyorsanız
    navigate("/"); // Ana sayfaya yönlendirme
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "none",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
