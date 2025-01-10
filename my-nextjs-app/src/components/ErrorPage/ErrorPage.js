import React from "react";
import styles from "./ErrorPage.module.css";

function ErrorPage({ message }) {
  return (
    <div className={styles.errorContainer}>
      <h1>{message || "Oops! Something went wrong."}</h1>
      <p>Please contact Admin to resolve the issue</p>
    </div>
  );
}

export default ErrorPage;

