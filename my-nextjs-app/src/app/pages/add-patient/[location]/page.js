"use client";
import React, { useState } from "react";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import TextArea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import { addPatient } from "@/utils/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useParams } from "next/navigation";
import withAuth from "@/hoc/withAuth";

const PatientRegistration = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const location = params?.location;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addPatient(
        name,
        phoneNumber,
        address,
        parseInt(age),
        gender,
        occupation,
        location
      );
      if (response.message) {
        setSuccessMessage(`Patient: ${name} added successfully!`);
        setAddress("");
        setName("");
        setAge("");
        setGender("");
        setPhoneNumber("");
        setOccupation("");
      }
    } catch (err) {
      setError("Error adding patient. Please try again.");
    }
  };

  const inputSize = "medium";

  const dropdownOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const message = error || successMessage;
  const type = error ? "error" : successMessage ? "success" : "";

  return (
    <div>
      <NavBar location={location} />
      <h1 className={styles.title}>Patient Registration</h1>
      <div className={styles.registrationContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {message && <ErrorMessage message={message} type={type} duration={5000}/>}
          <div className={styles.formGroup}>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size={inputSize}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              size={inputSize}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              size={inputSize}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              type="text"
              placeholder="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              size={inputSize}
            />
          </div>

          <div className={styles.formGroup}>
            <Dropdown
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={dropdownOptions}
              size={inputSize}
            />
          </div>

          <div className={styles.formGroup}>
            <TextArea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              size={inputSize}
            />
          </div>

          <Button
            text="Submit"
            type="submit"
            size={inputSize}
            className={styles.submitButton}
          />
        </form>
      </div>
    </div>
  );
};
export default withAuth(PatientRegistration);
