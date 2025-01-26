"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth";
import Dropdown from "@/components/Dropdown/Dropdown";
import styles from "./page.module.css";
import { GENDER_OPTIONS } from "@/utils/Constants";
import { FiEdit } from "react-icons/fi";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { addComplaint, getComplaint, getPatient } from "@/utils/api";
import { FaChevronLeft, FaChevronRight, FaFilePdf } from "react-icons/fa";
import { handleGenerateReport } from "@/utils/reportGenerator"; // Update this import path
import { extractDate } from "@/utils/handlers";

const PatientHistory = () => {
  const params = useParams();
  const locationParam = params?.location;
  const [patients, setPatients] = useState([]);
  const [complaints, setComplaints] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatient(locationParam);
        if (patientData && patientData.patients) {
          setPatients(patientData.patients);
          const complaintsMap = {};
          for (let i = 0; i < patientData.patients.length; i++) {
            const patient = patientData.patients[i];
            const complaintData = await getComplaint(patient.id);
            complaintsMap[patient.id] = complaintData?.patients || [];
          }
          setComplaints(complaintsMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [locationParam]);

  const [filters, setFilters] = useState({ gender: "", status: "" });
  const statusOptions = [
    { value: "Cured", label: "Cured" },
    { value: "Under Treatment", label: "Under Treatment" },
  ];

  const filteredPatients = patients.filter((patient) => {
    const patientComplaints = complaints[patient.id] || [];

    const allComplaintsCured = patientComplaints.every(
      (complaint) => complaint.status === true
    );
    const anyComplaintUnderTreatment = patientComplaints.some(
      (complaint) => complaint.status === false
    );

    const genderMatches =
      filters.gender === "" ||
      patient.gender.toLowerCase() === filters.gender.toLowerCase();

    const statusMatches =
      filters.status === "" ||
      (filters.status === "Cured" && allComplaintsCured) ||
      (filters.status === "Under Treatment" && anyComplaintUnderTreatment);

    return genderMatches && statusMatches;
  });

  // Create an array of all complaint rows to be displayed in the table
  const allComplaintRows = [];
  filteredPatients.forEach((patient) => {
    const patientComplaints = complaints[patient.id] || [];
    patientComplaints.forEach((complaint) => {
      allComplaintRows.push({
        patient,
        complaint,
      });
    });
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(allComplaintRows.length / recordsPerPage);

  // Pagination handler
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get the records for the current page (pagination)
  const currentRecords = allComplaintRows.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Update complaint status to 'Cured'
  const handleStatusUpdate = async (patientId) => {
    try {
      const response = await addComplaint({ id: patientId, status: true });
      if (response && response.message) {
        setComplaints((prev) => {
          return {
            ...prev,
            [patientId]: prev[patientId].map((complaint) => ({
              ...complaint,
              status: true,
            })),
          };
        });
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const getLatestVisitDate = (complaints) => {
    const dates = [];

    complaints.forEach((complaint) => {
      if (complaint.date) {
        const complaintDate = new Date(complaint.date);
        if (!isNaN(complaintDate.getTime())) {
          dates.push(complaintDate);
        }
      }

      if (complaint.followup && Array.isArray(complaint.followup)) {
        complaint.followup.forEach((followup) => {
          if (followup.date) {
            const followupDate = new Date(followup.date);
            if (!isNaN(followupDate.getTime())) {
              dates.push(followupDate);
            }
          }
        });
      }
    });

    if (dates.length === 0) return "N/A";

    const latestDate = new Date(
      Math.max(...dates.map((date) => date.getTime()))
    );

    return extractDate(latestDate);
  };

  // Handle generating and previewing the report
  const handleGenerateAndPreviewReport = async (patientId, chiefComplaint) => {
    try {
      const specificPatientComplaints = complaints[patientId] || [];
      const specificComplaint = specificPatientComplaints.find(
        (complaint) => complaint.chiefComplaint === chiefComplaint
      );

      if (specificComplaint) {
        await handleGenerateReport(
          patientId,
          specificComplaint, // Pass specific complaint data
          patients, // All patients data
          setPreviewUrl // Function to handle preview URL
        );
      } else {
        console.error(
          "Complaint not found for the given patient and chief complaint."
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div>
      <NavBar location={locationParam} />
      <div className={styles.container}>
        <h1 className={styles.title}>Patient History</h1>
        <div className={styles.filters}>
          <div className={styles.dropdownWrapper}>
            <Dropdown
              label="Gender"
              options={GENDER_OPTIONS}
              value={filters.gender}
              onChange={(e) =>
                setFilters({ ...filters, gender: e.target.value })
              }
              size="medium"
            />
          </div>
          <div className={styles.dropdownWrapper}>
            <Dropdown
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              size="medium"
            />
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Date of Visit</th>
                <th>Chief Complaint</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(({ patient, complaint }, index) => {
                let totalAmount = complaint.amount || 0;
                if (complaint.followup && Array.isArray(complaint.followup)) {
                  totalAmount += complaint.followup.reduce(
                    (sum, followup) => sum + (followup.amount || 0),
                    0
                  );
                }
                const latestVisitDate = getLatestVisitDate([complaint]);
                return (
                  <tr key={`${patient.id}-${index}`}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.mobileNumber}</td>
                    <td>{patient.gender}</td>
                    <td>{latestVisitDate}</td>
                    <td>{complaint.chiefComplaint}</td>
                    <td>{totalAmount}</td>
                    <td>{complaint.status ? "Cured" : "Under Treatment"}</td>
                    <td>
                      {complaint.status === false ? (
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="button-tooltip">
                              Click to update the status to Cured
                            </Tooltip>
                          }
                        >
                          <button
                            className={styles.editIcon}
                            onClick={() => handleStatusUpdate(patient.id)}
                          >
                            <FiEdit size={20} />
                          </button>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="report-tooltip">
                              Download Report
                            </Tooltip>
                          }
                        >
                          <button
                            className={styles.generateReportIcon}
                            onClick={() =>
                              handleGenerateAndPreviewReport(
                                patient.id,
                                complaint.chiefComplaint
                              )
                            }
                          >
                            <FaFilePdf
                              size={20}
                              className={styles.reportIcon}
                            />
                          </button>
                        </OverlayTrigger>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={20} /> {/* Previous Icon */}
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={20} /> {/* Next Icon */}
            </button>
          </div>
        )}
        {/* Add a modal or iframe for previewing */}
        {previewUrl && (
          <div className={styles.previewContainer}>
            <iframe
              src={previewUrl}
              width="100%"
              height="800px"
              title="PDF Preview"
              frameBorder="0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PatientHistory);
