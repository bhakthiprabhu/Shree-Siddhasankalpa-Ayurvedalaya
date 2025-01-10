import React, { useState, useEffect } from "react";
import styles from "./ErrorMessage.module.css";  

const ErrorMessage = ({ message, type = "error", duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);  

  useEffect(() => {
    if (!message) return;  

    const timer = setTimeout(() => {
      setIsVisible(false);  
    }, duration);

    return () => clearTimeout(timer);  
  }, [message, duration]);

  if (!isVisible || !message) return null;  

  const messageStyle = type === "success" ? styles.success : styles.error; 

  return <div className={`${styles.message} ${messageStyle}`}>{message}</div>;
};

export default ErrorMessage;
