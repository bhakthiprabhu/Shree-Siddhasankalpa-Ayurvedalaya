import React, { useState, useEffect, useRef } from "react";
import styles from "./ErrorMessage.module.css";  

const ErrorMessage = ({ message, type = "error", duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);  
  const messageRef = useRef(null);

  useEffect(() => {
    if (!message) return;  

    setIsVisible(true);  

    // Scroll to the error message
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const timer = setTimeout(() => {
      setIsVisible(false);  
    }, duration);

    return () => clearTimeout(timer);  
  }, [message, duration]);

  if (!isVisible || !message) return null;  

  const messageStyle = type === "success" ? styles.success : styles.error; 

  return (
    <div ref={messageRef} className={`${styles.message} ${messageStyle}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;
