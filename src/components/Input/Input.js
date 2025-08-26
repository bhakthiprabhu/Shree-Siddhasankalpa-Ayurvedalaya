import React from "react";
import styles from "./Input.module.css";

const Input = ({ type, placeholder, value, onChange, size, error, readOnly, disabled }) => {
  const sizeClass = size ? styles[size] : styles.medium;

  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.inputField} ${sizeClass} ${error ? styles.error : ""}`}
        required
        readOnly={readOnly}
        disabled={disabled}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
