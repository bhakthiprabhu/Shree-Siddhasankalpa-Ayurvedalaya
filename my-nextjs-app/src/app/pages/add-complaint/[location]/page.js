"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Dropdown from "@/components/Dropdown/Dropdown";
import { addComplaint, getPatient } from "@/utils/api";

const ComplaintDetails = () => {
  const params = useParams();
  const location = params?.location;
  const storedPhno = sessionStorage.getItem("phno");
  const storedName = sessionStorage.getItem("name");

  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [associatedComplaint, setAssociatedComplaint] = useState("");
  const [investigation, setInvestigation] = useState("");
  const [ashtaSthana, setAshtaSthana] = useState("");
  const [dashaVidha, setDashaVidha] = useState("");
  const [otherExamination, setOtherExamination] = useState("");
  const [panchakarma, setPanchakarma] = useState("");
  const [medicine, setMedicine] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [inputerror, setInputError] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Fetch patients based on location and phone number
  useEffect(() => {
    const fetchPatients = async (location, phoneNumber) => {
      try {
        const patientData = await getPatient(location, phoneNumber);
        if (patientData.patients && patientData.patients.length > 0) {
          setPatientData(patientData.patients); // Directly set the patients list
        } else {
          setInputError("No patients found for the provided phone number.");
        }
      } catch (error) {
        setInputError("Failed to fetch patients. Please try again.");
      }
    };

    if (storedPhno && storedName) {
      setPhoneNumber(storedPhno);
      setPatientName(storedName);
      fetchPatients(location, storedPhno);
    } else if (phoneNumber) {
      if (/^\d{10}$/.test(phoneNumber)) {
        fetchPatients(location, phoneNumber);
      } else {
        setInputError("Please enter a valid 10-digit phone number");
      }
    } else {
      setInputError("Please enter phone number");
    }
  }, [location, phoneNumber, storedPhno, storedName]);

  // Filter patients and set dropdown options after fetching patient data
  useEffect(() => {
    if (patientData.length > 0) {
      const filtered = patientData.filter((patient) =>
        patient.mobileNumber.includes(phoneNumber)
      );
      setFilteredPatients(filtered);
      setDropdownOptions(
        filtered.map((patient) => ({
          value: patient.name,
          label: patient.name,
        }))
      );
      setInputError(""); // Reset input error after successful fetch
    }
  }, [patientData, phoneNumber]);

  // Handle patient selection from dropdown
  const handlePatientSelect = (e) => {
    const selectedName = e.target.value;
    setDropdownError("");
    const selectedPatient = filteredPatients.find(
      (patient) => patient.name === selectedName
    );
    setSelectedPatient(selectedPatient);

    // Set patientId when patient is selected
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      setPatientName(selectedPatient.name); 
    }
  };

  // If patient ID and patient name are set from session, ensure they are correctly mapped
  useEffect(() => {
    if (storedPhno && storedName) {
      const selectedPatient = patientData.find(
        (patient) => patient.name === storedName && patient.mobileNumber === storedPhno
      );
      if (selectedPatient) {
        setPatientId(selectedPatient.id); // Set the patient ID from the session
      }
    }
  }, [patientData, storedPhno, storedName]); // This effect runs when patientData is updated

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        id: patientId,
        chiefComplaint: chiefComplaint,
        associatedComplaint: associatedComplaint,
        investigation: investigation,
        ashtasthana: ashtaSthana,
        dashavidha: dashaVidha,
        others: otherExamination,
        panchakarma: panchakarma,
        medicine: medicine,
        amount: parseInt(amount),
        paymentmode: paymentMode,
        Status: false,
      };
      const response = await addComplaint(formData);
      if (response.message) {
        setSuccessMessage(response.message);
        setTimeout(() => {
          setPhoneNumber("");
          setPatientName("");
          setChiefComplaint("");
          setAssociatedComplaint("");
          setInvestigation("");
          setAshtaSthana("");
          setDashaVidha("");
          setOtherExamination("");
          setPanchakarma("");
          setMedicine("");
          setAmount("");
          setpaymentMode("");
          setDropdownOptions([]);
          sessionStorage.clear();
        }, 3000);
      }
    } catch (err) {
      setError("Error submitting complaint details. Please try again.");
    }
  };

  const inputSize = "medium";

  const message = error || successMessage;
  const type = error ? "error" : successMessage ? "success" : "";

  return (
    <>
      <NavBar location={location} />
      <div className={styles.container}>
        <h1 className={styles.title}>Complaint Details</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {message && (
            <ErrorMessage message={message} type={type} duration={3000} />
          )}
          {/* Patient Details Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Patient Profile</h2>
            <div className={styles.grid}>
              <Input
                type="text"
                placeholder="Phone Number"
                value={storedPhno ? storedPhno : phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size={inputSize}
                error={inputerror}
                disabled={!!storedPhno}
              />

              {storedPhno ? (
                <Dropdown
                  options={dropdownOptions}
                  value={patientName}
                  size={inputSize}
                  error={dropdownError}
                  disabled={!!storedPhno}
                />
              ) : filteredPatients.length > 0 && phoneNumber ? (
                <Dropdown
                  options={dropdownOptions}
                  value={patientName}
                  onChange={handlePatientSelect}
                  size={inputSize}
                  error={dropdownError}
                />
              ) : (
                <p className={styles.text}>No matching patients found</p>
              )}
            </div>
          </div>

          {/* Complaint Details Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Complaint Details</h2>
            <Input
              type="text"
              placeholder="Chief Complaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Associated Complaint"
              value={associatedComplaint}
              onChange={(e) => setAssociatedComplaint(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Investigation"
              value={investigation}
              onChange={(e) => setInvestigation(e.target.value)}
              size={inputSize}
            />
          </div>

          {/* Examination and Diagnosis Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Examination and Diagnosis</h2>
            <Input
              type="text"
              placeholder="Ashta-sthana Pareeksha"
              value={ashtaSthana}
              onChange={(e) => setAshtaSthana(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Dashavidha Pareeksha"
              value={dashaVidha}
              onChange={(e) => setDashaVidha(e.target.value)}
              size={inputSize}
            />
            <Input
              type="text"
              placeholder="Other Examination"
              value={otherExamination}
              onChange={(e) => setOtherExamination(e.target.value)}
              size={inputSize}
            />
          </div>

          {/* Treatment Section */}
          <div className={styles.formGroup}>
            <h2 className={styles.heading}>Treatment</h2>
            <Input
              type="text"
              placeholder="Panchakarma"
              value={panchakarma}
              onChange={(e) => setPanchakarma(e.target.value)}
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
              onChange={(e) => setpaymentMode(e.target.value)}
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
    </>
  );
};

export default withAuth(ComplaintDetails);
