"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth";
import Dropdown from "@/components/Dropdown/Dropdown";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import styles from "./page.module.css";
import { getPatient, addComplaint, getComplaint } from "@/utils/api";

const FollowUpPage = () => {
  const params = useParams();
  const location = params?.location;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [inputError, setInputError] = useState("");
  const [dropdownError, setDropdownError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [presentCondition, setPresentCondition] = useState("");
  const [medicine, setMedicine] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const fetchPatients = async (location, phoneNumber) => {
      if (!/^\d{10}$/.test(phoneNumber)) {
        setInputError("Please enter a valid 10-digit phone number");
        return;
      }

      setInputError("");  // Clear previous errors if any
      try {
        const response = await getPatient(location, phoneNumber);
        if (response.patients && response.patients.length > 0) {
          // Filter patients based on phone number
          const filtered = response.patients.filter((patient) =>
            patient.mobileNumber.includes(phoneNumber)
          );

          // Fetch complaints for each patient and filter out those with no complaints or with status true
          const validPatients = [];
          for (const patient of filtered) {
            const complaintResponse = await getComplaint(patient.id);

            // Log the complaint response to check its structure
            console.log(`Complaint response for patient ${patient.id}:`, complaintResponse);

            if (complaintResponse && complaintResponse.patients) {
              if (complaintResponse.patients !== null) {
                // Log complaints to check their structure
                console.log(`Complaints for patient ${patient.id}:`, complaintResponse.patients);

                // Check if there's at least one complaint with status false
                const validComplaint = complaintResponse.patients.some(complaint => complaint.status === false);
                console.log(`Valid complaint found for patient ${patient.id}:`, validComplaint);

                if (validComplaint) {
                  validPatients.push(patient);
                }
              } else {
                // If patients are null, log that no complaints exist
                console.log(`No complaints found for patient ${patient.id}`);
              }
            }
          }

          setFilteredPatients(validPatients);
          setDropdownOptions(validPatients.map((patient) => ({
            value: patient.name,
            label: patient.name,
          })));
        } else {
          setInputError("No patients found for the provided phone number.");
        }
      } catch (error) {
        setInputError("Failed to fetch patients. Please try again.");
      }
    };

    if (phoneNumber) {
      fetchPatients(location, phoneNumber);
    } else {
      setInputError("Please enter phone number");
    }
  }, [phoneNumber, location]);

  const handlePatientSelect = (e) => {
    const selectedName = e.target.value;
    setDropdownError("");
    const selectedPatient = filteredPatients.find(
      (patient) => patient.name === selectedName
    );
    setSelectedPatient(selectedPatient);
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      console.log(selectedPatient.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      id: patientId,
      condition: presentCondition,
      medicine: medicine,
      amount: parseInt(amount),
      paymentmode: paymentMode,
      isFollowup: true,
    };

    try {
      const response = await addComplaint(formData);
      if (response && response.message) {
        setSuccessMessage(response.message);
        setTimeout(() => {
          setSuccessMessage("");
          setDropdownOptions([]);
          setPhoneNumber("");
          setPresentCondition("");
          setMedicine("");
          setAmount("");
          setPaymentMode("");
        }, 3000);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      setError("Error submitting follow-up details. Please try again.");
    }
  };

  const inputSize = "medium";
  const message = error || successMessage;
  const messageType = error ? "error" : successMessage ? "success" : "";

  return (
    <div>
      <NavBar location={location} />
      <div className={styles.container}>
        <h1 className={styles.title}>Patient Follow-Up</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {message && <ErrorMessage message={message} type={messageType} duration={3000} />}
          
          {/* Patient Details Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Patient Profile</h2>
            <div className={styles.grid}>
              <Input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size={inputSize}
                error={inputError}
              />
              {filteredPatients.length > 0 && phoneNumber && (
                <Dropdown
                  options={dropdownOptions}
                  value={selectedPatient ? selectedPatient.name : ""}
                  onChange={handlePatientSelect}
                  size={inputSize}
                  error={dropdownError}
                />
              )}
              {!phoneNumber && <p className={styles.text}>Please enter a phone number to search</p>}
              {filteredPatients.length === 0 && phoneNumber && <p className={styles.text}>No matching patients found</p>}
            </div>
          </div>

          {/* Follow-Up Details Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Follow-Up Details</h2>
            <Input
              type="text"
              placeholder="Present Condition"
              value={presentCondition}
              onChange={(e) => setPresentCondition(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Medicine"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              size={inputSize}
            />
          </div>

          {/* Payment Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Payment</h2>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Payment Mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              size={inputSize}
            />
          </div>

          {/* Submit Button */}
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

export default withAuth(FollowUpPage);
