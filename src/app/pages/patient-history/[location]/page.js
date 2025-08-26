'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar/NavBar';
import withAuth from '@/hoc/withAuth';
import Dropdown from '@/components/Dropdown/Dropdown';
import styles from './page.module.css';
import { FiEdit } from 'react-icons/fi';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Input from '@/components/Input/Input';
import { addComplaint, getComplaint, getPatient } from '@/utils/api';
import Button from '@/components/Button/Button';
import { FaChevronLeft, FaChevronRight, FaFilePdf } from 'react-icons/fa';
import { handleGenerateReport } from '@/utils/reportGenerator';
import { extractDate } from '@/utils/handlers';

const PatientHistory = () => {
  const router = useRouter();
  const params = useParams();
  const locationParam = params?.location;
  const [patients, setPatients] = useState([]);
  const [complaints, setComplaints] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  // State for selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inputError, setInputError] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownError, setDropdownError] = useState('');

  useEffect(() => {
    const fetchSelectedPatientData = async () => {
      if (!/^\d{10}$/.test(phoneNumber)) {
        setInputError('Please enter a valid 10-digit phone number');
        return;
      }
      setInputError('');
      try {
        const response = await getPatient(locationParam, phoneNumber);
        if (response.patients && response.patients.length > 0) {
          const filtered = response.patients.filter((patient) =>
            patient.mobileNumber.includes(phoneNumber)
          );

          setFilteredPatients(filtered);
          setDropdownOptions(
            filtered.map((patient) => ({
              value: patient.name,
              label: patient.name,
            }))
          );
        } else {
          setInputError('No patients found for the provided phone number.');
        }
      } catch (error) {
        setInputError('Failed to fetch patients. Please try again.');
      }
    };

    if (phoneNumber) {
      fetchSelectedPatientData();
    } else {
      setInputError('Please enter a phone number to search for patients.');
    }
  }, [phoneNumber, locationParam]);

  useEffect(() => {
    const fetchComplaintsForSelectedPatient = async () => {
      if (selectedPatient) {
        try {
          const complaintData = await getComplaint(selectedPatient.id);
          setComplaints({
            [selectedPatient.id]: complaintData?.patients || [],
          });
        } catch (error) {
          setComplaints({});
        }
      }
    };

    fetchComplaintsForSelectedPatient();
  }, [selectedPatient]);

  const filteredComplaintRows = selectedPatient
    ? (complaints[selectedPatient.id] || []).map((complaint) => ({
        patient: selectedPatient,
        complaint,
      }))
    : [];

  // Handle dropdown selection
  const handlePatientSelect = (e) => {
    const selectedValue = e.target.value;

    setDropdownError('');
    const selectedPatient = filteredPatients.find(
      (patient) => patient.name === selectedValue
    );
    setSelectedPatient(selectedPatient);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredComplaintRows.length / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const currentRecords = filteredComplaintRows.slice(
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
      }
    } catch (error) {}
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

    if (dates.length === 0) return 'N/A';

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
          filteredPatients, // All patients data
          setPreviewUrl // Function to handle preview URL
        );
      } else {
      }
    } catch (error) {}
  };

  // Handle patient click
  const handlePatientClick = (patientId, chiefComplaint) => {
    try {
      console.log('Patient ID:', patientId);
      console.log('Chief Complaint:', chiefComplaint);
      const specificPatientComplaints = complaints[patientId] || [];
      const specificComplaint = specificPatientComplaints.find(
        (complaint) => complaint.chiefComplaint === chiefComplaint
      );

      const specificPatient = filteredPatients.find((p) => p.id === patientId);
      console.log('Specific Complaint:', specificComplaint);
      console.log('Specific Patient:', specificPatient);

      if (specificComplaint && specificPatient) {
        sessionStorage.setItem(
          'specificComplaint',
          JSON.stringify(specificComplaint)
        );
        sessionStorage.setItem(
          'specificPatient',
          JSON.stringify(specificPatient)
        );
        router.push(`/pages/report/${locationParam}`);
      } else {
        console.error('Patient or complaint not found');
      }
    } catch (error) {
      console.error('Error handling patient click:', error);
    }
  };

  // Clear the filter
  const clearFilter = () => {
    setPhoneNumber(''); // Clear the phone number input
    setFilteredPatients([]); // Clear the filtered patients
    setSelectedPatient(null); // Reset the selected patient
    setInputError(''); // Clear any previous error
    setDropdownError(''); // Clear any dropdown error
  };

  const inputSize = 'medium';

  return (
    <div>
      <NavBar location={locationParam} />
      <div className={styles.container}>
        <h1 className={styles.title}>Patient History</h1>
        <div className={styles.formGroup}>
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
                value={selectedPatient ? selectedPatient.name : ''}
                onChange={handlePatientSelect}
                size={inputSize}
                error={dropdownError}
              />
            )}
            {!phoneNumber && <p className={styles.text}></p>}
            {filteredPatients.length === 0 && phoneNumber && (
              <p className={styles.text}>No matching patients found</p>
            )}
            {/* Clear Filter Button */}
            <div className={styles.clearFilter}>
              {phoneNumber && (
                <Button text="Clear Filter" onClick={clearFilter} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
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
                      <td
                        onClick={() =>
                          handlePatientClick(
                            patient.id,
                            complaint.chiefComplaint
                          )
                        }
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}>
                        {patient.id}
                      </td>
                      <td>{patient.name}</td>
                      <td>{patient.mobileNumber}</td>
                      <td>{patient.gender}</td>
                      <td>{latestVisitDate}</td>
                      <td>{complaint.chiefComplaint}</td>
                      <td>{totalAmount}</td>
                      <td>{complaint.status ? 'Cured' : 'Under Treatment'}</td>
                      <td>
                        {complaint.status === false ? (
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="button-tooltip">
                                Click to update the status to Cured
                              </Tooltip>
                            }>
                            <button
                              className={styles.editIcon}
                              onClick={() => handleStatusUpdate(patient.id)}>
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
                            }>
                            <button
                              className={styles.generateReportIcon}
                              onClick={() =>
                                handleGenerateAndPreviewReport(
                                  patient.id,
                                  complaint.chiefComplaint
                                )
                              }>
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
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}>
              <FaChevronLeft size={20} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}>
              <FaChevronRight size={20} />
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
