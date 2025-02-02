// src/Callback.tsx
import { useEffect } from "react";
import { handleCallback } from "./services/authService";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processLogin = async () => {
      try {
        const user = await handleCallback();
        if (user) {
          navigate("/");
        } else {
          console.error("Authentication failed");
        }
      } catch (error) {
        console.error("Error during callback processing:", error);
      }
    };

    processLogin();
  }, [navigate]);

  return <p>Processing authentication...</p>;
};

export default Callback;
