import React from "react";
import styles from "./Dropdown.module.css";

const Dropdown = ({ label, options, value, onChange, error, size, disabled }) => {
  const sizeClass = size ? styles[size] : styles.medium;

  return (
    <div className={styles.dropdownWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={`${styles.dropdown} ${sizeClass} ${error ? styles.error : ""}`}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Dropdown;
