import React from "react";
import styles from "./Textarea.module.css";

const Textarea = ({ label, value, onChange, placeholder, error, size }) => {
  const sizeClass = size ? styles[size] : styles.medium;

  return (
    <div className={styles.textareaWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={`${styles.textarea} ${sizeClass} ${error ? styles.error : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Textarea;
