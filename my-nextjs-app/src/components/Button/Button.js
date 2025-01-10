import React from "react";
import styles from "./Button.module.css";

const Button = ({ text, type = "button", onClick, size, disabled, className }) => {
  const sizeClass = size ? styles[size] : styles.medium;

  return (
    <button
      type={type}
      className={`${styles.button} ${sizeClass} ${disabled ? styles.disabled : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles["button-heading"]}>{text}</span>
    </button>
  );
};

export default Button;
