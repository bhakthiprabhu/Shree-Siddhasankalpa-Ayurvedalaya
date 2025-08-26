"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth";
import styles from "./page.module.css";
import { extractDate } from "@/utils/handlers";

const ReportPage = () => {
  const params = useParams();
  const location = params?.location;

  // State to store patient and complaint details
  const [patientDetails, setPatientDetails] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);

  useEffect(() => {
    // Get the data from sessionStorage and parse it
    const patientData = sessionStorage.getItem("specificPatient");
    const complaintData = sessionStorage.getItem("specificComplaint");

    if (patientData && complaintData) {
      setPatientDetails(JSON.parse(patientData));
      setComplaintDetails(JSON.parse(complaintData));
    }
  }, []);

  if (!patientDetails || !complaintDetails) {
    return <div className={styles.loading}>Loading...</div>; // Display a loading message while data is being fetched
  }

  return (
    <div>
      <NavBar location={location} />
      <div className={styles.reportContainer}>
        {/* Report Header */}
        <h1 className={styles.title}>Report</h1>
        {/* Report Content Container */}
        <div className={styles.reportContent}>
          {/* Patient Details Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Patient Details</h2>
            <div className={styles.patientDetails}>
              <ul className={styles.detailsList}>
                <li>
                  <strong>Patient ID:</strong> {patientDetails.id}
                </li>
                <li>
                  <strong>Name:</strong> {patientDetails.name}
                </li>
                <li>
                  <strong>Age:</strong> {patientDetails.age}
                </li>
                <li>
                  <strong>Gender:</strong> {patientDetails.gender}
                </li>
                <li>
                  <strong>Address:</strong> {patientDetails.address}
                </li>
                <li>
                  <strong>Occupation:</strong> {patientDetails.occupation}
                </li>
                <li>
                  <strong>Phone Number:</strong> {patientDetails.mobileNumber}
                </li>
              </ul>
            </div>
          </section>

          {/* Complaint Details Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Complaint Details</h2>
            <div className={styles.complaintDetails}>
              <ul className={styles.detailsList}>
                <li>
                  <strong>Chief Complaint:</strong>{" "}
                  {complaintDetails.chiefComplaint}
                </li>
                <li>
                  <strong>Associated Complaints:</strong>{" "}
                  {complaintDetails.associatedComplaint}
                </li>
                <li>
                  <strong>Investigation:</strong>{" "}
                  {complaintDetails.investigation}
                </li>
                <section className={styles.section}>
                  <h2 className={styles.sectionSubtitle}>
                    Ashta-sthana Pareeksha
                  </h2>
                  <div className={styles.followupItem}>
                    <ul className={styles.detailsList}>
                      <li>
                        <strong>Nadi:</strong> {complaintDetails.nadi}
                      </li>
                      <li>
                        <strong>Mutra:</strong> {complaintDetails.mutra}
                      </li>
                      <li>
                        <strong>Mala:</strong> {complaintDetails.mala}
                      </li>
                      <li>
                        <strong>Jihwa:</strong> {complaintDetails.jihwa}
                      </li>
                      <li>
                        <strong>Shabda:</strong> {complaintDetails.shabda}
                      </li>
                      <li>
                        <strong>Sparsha:</strong> {complaintDetails.sparsha}
                      </li>
                      <li>
                        <strong>Drika:</strong> {complaintDetails.drika}
                      </li>
                      <li>
                        <strong>Akriti:</strong> {complaintDetails.akriti}
                      </li>
                    </ul>
                  </div>
                </section>
                <section className={styles.section}>
                  <h2 className={styles.sectionSubtitle}>
                    Dashavidh Pareeksha
                  </h2>
                  <div className={styles.followupItem}>
                    <ul className={styles.detailsList}>
                      <li>
                        <strong>Prakruti:</strong> {complaintDetails.prakruti}
                      </li>
                      <li>
                        <strong>Vikruti:</strong> {complaintDetails.vikruti}
                      </li>
                      <li>
                        <strong>Sara:</strong> {complaintDetails.sara}
                      </li>
                      <li>
                        <strong>Samhanana:</strong> {complaintDetails.samhanana}
                      </li>
                      <li>
                        <strong>Pramana:</strong> {complaintDetails.pramana}
                      </li>
                      <li>
                        <strong>Satmya:</strong> {complaintDetails.satmya}
                      </li>
                      <li>
                        <strong>Satva:</strong> {complaintDetails.satva}
                      </li>
                      <li>
                        <strong>Aahara:</strong> {complaintDetails.aahara}
                      </li>
                      <li>
                        <strong>Vyayam:</strong> {complaintDetails.vyayam}
                      </li>
                      <li>
                        <strong>Vaya:</strong> {complaintDetails.vaya}
                      </li>
                    </ul>
                  </div>
                </section>
                <li>
                  <strong>Other Details:</strong> {complaintDetails.others}
                </li>
                <li>
                  <strong>Diagnosis:</strong> {complaintDetails.diagnosis}
                </li>
                <li>
                  <strong>Panchakarma:</strong> {complaintDetails.panchakarma}
                </li>
                <li>
                  <strong>Medicine:</strong> {complaintDetails.medicine}
                </li>
                <li>
                  <strong>Amount:</strong> ₹{complaintDetails.amount}
                </li>
                <li>
                  <strong>Date:</strong> {extractDate(complaintDetails.date)}
                </li>
              </ul>
            </div>
          </section>

          {/* Follow-up Details Section (only show if followup exists) */}
          {complaintDetails.followup &&
            complaintDetails.followup.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.subsectionTitle}>Follow-up Details</h3>
                <div className={styles.followupDetails}>
                  {complaintDetails.followup.map((followup, index) => (
                    <div key={index} className={styles.followupItem}>
                      <ul className={styles.detailsList}>
                        <li>
                          <strong>Medicine:</strong> {followup.medicine}
                        </li>
                        <li>
                          <strong>Condition:</strong> {followup.condition}
                        </li>
                        <li>
                          <strong>Amount:</strong> ₹{followup.amount}
                        </li>
                        <li>
                          <strong>Payment Mode:</strong> {followup.paymentmode}
                        </li>
                        <li>
                          <strong>Date:</strong> {extractDate(followup.date)}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ReportPage);
