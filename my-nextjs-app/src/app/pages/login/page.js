"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/assets/images/Logo.jpeg";
import { loginData } from "@/utils/api";
import { useRouter } from "next/navigation";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { APP_INFO, LOCATION_OPTIONS } from "@/utils/Constants";
import { setToken } from "@/utils/auth";
import styles from "./page.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const { data, headers } = await loginData(username, password);
      if (data.message) {
        const token = headers.authorization;
        setToken(token);
        router.push(`/pages/dashboard/${location}`);
        setSuccessMessage("Login successful!");
      }
    } catch (error) {
      if (error.response) {
        setError("Invalid Username or Password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const inputSize = "medium";

  const message = error || successMessage;
  const type = error ? "error" : successMessage ? "success" : "";

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.loginContainer}>
        <Image
          src={Logo}
          alt="Logo"
          width={80}
          height={80}
          className={styles.logo}
        />
        <h1 className={styles.title}>{APP_INFO.APP_NAME}</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {message && <ErrorMessage message={message} type={type} duration={2000}/>}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size={inputSize}
          />

          <Dropdown
            options={LOCATION_OPTIONS}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            size={inputSize}
          />
          <Button text="Login" type="submit" size={inputSize} />
        </form>
      </div>
    </div>
  );
}
