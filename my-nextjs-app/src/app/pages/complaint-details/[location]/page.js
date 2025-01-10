"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Dropdown from "@/components/Dropdown/Dropdown";
import { getPatient } from "@/utils/api";
import { getComplaint } from "@/utils/api";

const ComplaintDetails = () => {
  const params = useParams();
  const location = params?.location;

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [associatedComplaint, setAssociatedComplaint] = useState("");
  const [investigation, setInvestigation] = useState("");
  const [ashtaSthana, setAshtaSthana] = useState("");
  const [dashaVidha, setDashaVidha] = useState("");
  const [otherExamination, setOtherExamination] = useState("");
  const [panchakarma, setPanchakarma] = useState("");
  const [medicine, setMedicine] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const patientData = await getPatient(location, phoneNumber);
      const allPatients = patientData.patients;

      if (phoneNumber) {
        const filtered = allPatients.filter((patient) =>
          patient.mobileNumber.includes(phoneNumber)
        );
        setFilteredPatients(filtered);
      } else {
        setFilteredPatients([]);
      }
    };

    fetchPatients();
  }, [phoneNumber, location]);

  const handlePatientSelect = async (e) => {
    const selectedName = e.target.value;
    const selectedPatient = filteredPatients.find(
      (patient) => patient.name === selectedName
    );
    setSelectedPatient(selectedPatient);
    if (selectedPatient) {
      try {
        const complaintsData = await getComplaint(selectedPatient.id);
        setComplaints(complaintsData.patients);
      } catch (err) {
        setError("Failed to fetch complaints.");
      }
    }
  };

  const dropdownOptions = filteredPatients.map((patient) => ({
    value: patient.name,
    label: patient.name,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      patientName,
      age,
      phoneNumber,
      chiefComplaint,
      associatedComplaint,
      investigation,
      ashtaSthana,
      dashaVidha,
      otherExamination,
      panchakarma,
      medicine,
      amount,
    };
    console.log("Form Data Submitted:", formData);
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
            <ErrorMessage message={message} type={type} duration={5000} />
          )}
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
              />

              {filteredPatients.length > 0 && (
                <Dropdown
                  options={dropdownOptions}
                  value={selectedPatient ? selectedPatient.name : ""}
                  onChange={handlePatientSelect}
                  size={inputSize}
                />
              )}
              {filteredPatients.length === 0 && (
                <p className={styles.text}>No matching patients found</p>
              )}
            </div>
            {/* Report Section */}
            {filteredPatients.length > 0 && selectedPatient && (
              <div className={styles.patientHistory}>
                <h1 className={styles.reportHeading}>Report</h1>
                <div className={styles.reportSection}>
                  <h3 className={styles.subheading}>Personal Information</h3>
                  <div className={styles.detailItem}>
                    Name: <span>{selectedPatient.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    Age: <span>{selectedPatient.age}</span>
                  </div>
                  <div className={styles.detailItem}>
                    Phone Number:
                    <span>{selectedPatient.mobileNumber}</span>
                  </div>
                  <div className={styles.detailItem}>
                    Address:
                    <span>{selectedPatient.address}</span>
                  </div>
                </div>

                {complaints && (
                  <div className={styles.complaintContainer}>
                    {complaints.map((complaint, complaintIndex) => (
                      <div key={complaintIndex}>
                        <h2 className={styles.subheading}>
                          {complaintIndex + 1}. Complaint Details
                        </h2>

                        {/* Medical History Section for each complaint */}
                        <div className={styles.reportSection}>
                          <h3 className={styles.body}>Medical History:</h3>
                          <div className={styles.detailItem}>
                            Chief Complaint:
                            <span>{complaint.chiefComplaint}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Associated Complaint:
                            <span>{complaint.associatedComplaint}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Investigation:
                            <span>{complaint.investigation}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Ashta Sthana:
                            <span>{complaint.ashtasthana}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Dasha Vidha: <span>{complaint.dashavidha}</span>
                          </div>
                        </div>

                        {/* Treatment History Section for each complaint */}
                        <div className={styles.reportSection}>
                          <h3 className={styles.body}>Treatment History:</h3>
                          <div className={styles.detailItem}>
                            Other Examination:
                            <span>{complaint.others}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Panchakarma:
                            <span>{complaint.panchakarma}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Medicine: <span>{complaint.medicine}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Visit date: <span>{complaint.Date}</span>
                          </div>
                          <div className={styles.detailItem}>
                            Amount: <span>{complaint.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.date}>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            )}
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
