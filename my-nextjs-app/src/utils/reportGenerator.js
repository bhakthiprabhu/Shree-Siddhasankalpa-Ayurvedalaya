import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin
import logo from "@/assets/images/Logo.jpg";
import { extractDate } from "./handlers";
import { APP_INFO } from "./Constants";
import { convertedBase64 } from "./handlers";

export const handleGenerateReport = async (
  patientId,
  chiefComplaint,
  patients,
  setPreviewUrl
) => {
  try {
    const patient = patients.find((p) => p.id === patientId);
    const doc = new jsPDF();

    // Add Custom font
    doc.addFileToVFS("SamarkanNormal.ttf", convertedBase64);
    doc.addFont("SamarkanNormal.ttf", "Samarkan", "normal");

    // Set default font to Times New Roman
    doc.setFont("times");

    // Page dimensions and margins
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;
    const availableWidth = pageWidth - 2 * leftMargin;
    const bottomMargin = 20; // Set bottom margin

    let y = 50; // Start from below the header
    let pageNumber = 1;

    // Footer height and header height
    const headerHeight = 40; // Space reserved for header
    const footerHeight = 30; // Space reserved for footer

    // Function to add the header
    const addHeader = () => {
      // Add Logo
      const logoUrl = logo.src; // Replace this with the actual path or base64 URL of your logo
      const logoWidth = 26; // Adjust logo width
      const logoHeight = 26; // Adjust logo height
      doc.addImage(logoUrl, "JPG", 10, 10, logoWidth, logoHeight); // Add logo at top-left corner

      // Title and Clinic Details
      doc.setFontSize(19);
      doc.setFont("Samarkan", "normal");
      doc.text(
        APP_INFO.APP_NAME.toUpperCase(),
        pageWidth / 2,
        18,
        null,
        null,
        "center"
      ); // Clinic name

      doc.setFontSize(11);
      doc.setFont("times", "normal");
      doc.text(APP_INFO.APP_ADDRESS, pageWidth / 2, 24, null, null, "center"); // Clinic address

      doc.setFont("times", "italic");
      doc.text(APP_INFO.APP_EMAIL, pageWidth / 2, 34, null, null, "center");

      // Doctor Registration ID
      doc.setFontSize(10);
      doc.setFont("times", "normal");
      doc.text(
        APP_INFO.APP_PHONE_NUMBER,
        rightMargin + 10,
        17,
        null,
        null,
        "right"
      );
      doc.text(
        APP_INFO.APP_REGISTRATION_ID,
        rightMargin + 10,
        24,
        null,
        null,
        "right"
      );

      // Add line
      doc.line(10, 40, pageWidth - 10, 40);
    };

    // Add Footer - Only on the last page, after content ends
    const addFooter = () => {
      const currentDate = new Date().toLocaleDateString(); // Get today's date
      doc.setFontSize(10);
      doc.setFont("times", "bolditalic"); // Combine bold and italic
      y = y + 15;

      // Left side - Today's date
      doc.text(`Date: ${currentDate}`, leftMargin - 10, y);

      // Right side - Doctor's name and specialization
      doc.line(rightMargin - 50, y, rightMargin - 20, y);
      doc.text(APP_INFO.APP_DOCTOR, rightMargin - 50, y + 5);
      doc.text(APP_INFO.APP_DEGREE, rightMargin - 50, y + 10);
      doc.text(APP_INFO.APP_SPECIALITY, rightMargin - 50, y + 15);
    };

    // Function to add the page
    const addPage = () => {
      // Check if content exceeds the available space minus footer and bottom margin
      if (y > pageHeight - footerHeight - bottomMargin) {
        doc.addPage(); // Add a new page
        pageNumber += 1; // Increment the page number
        y = headerHeight + 10; // Reset Y position for new page (after header)
        addHeader(); // Add the header again for the new page
      }
    };

    // Title: Case Sheet with Underline
    addHeader();
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Case Sheet", pageWidth / 2, y, null, null, "center"); // Center align title
    doc.setDrawColor(0, 0, 0);
    doc.line(pageWidth / 2 - 20, y + 2, pageWidth / 2 + 20, y + 2); // Draw underline centered under title
    y += 10;

    // Function to check available space before adding content
    const checkAvailableSpace = (requiredSpace) => {
      const availableSpace = pageHeight - footerHeight - bottomMargin - y;
      if (availableSpace < requiredSpace) {
        addPage(); // This will add a new page and call addHeader() in the process
      }
    };

    // Patient Details (Two Column Layout)
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    // First Column (Left side)
    doc.setFont("times", "bold");
    doc.text("OPD No.:", leftMargin, y);
    doc.text("Name:", leftMargin, y + 8);
    doc.text("Gender:", leftMargin, y + 16);
    doc.text("Phone:", leftMargin, y + 24);

    doc.setFont("times", "normal");
    doc.text(`${patient.id}`, leftMargin + 20, y);
    doc.text(`${patient.name}`, leftMargin + 20, y + 8);
    doc.text(`${patient.gender}`, leftMargin + 20, y + 16);
    doc.text(`${patient.mobileNumber}`, leftMargin + 20, y + 24);

    // Second Column (Right side)
    const columnStartX = leftMargin + availableWidth / 2;
    doc.setFont("times", "bold");
    doc.text("Age:", columnStartX, y);
    doc.text("Date: ", columnStartX, y + 8);

    doc.setFont("times", "normal");
    doc.text(`${patient.age}`, columnStartX + 18, y);
    doc.text(`${extractDate(chiefComplaint.date)}`, columnStartX + 18, y + 8);
    y += 16; // Move down after patient details

    // Address Wrapping and Alignment Fix
    const addressMaxWidth = availableWidth / 2; // Wrap address in second column
    const addressLines = doc.splitTextToSize(patient.address, addressMaxWidth);
    doc.setFont("times", "bold");
    doc.text("Address:", columnStartX, y);
    doc.setFont("times", "normal");
    addressLines.forEach((line, index) => {
      doc.text(line, columnStartX + 18, y + index * 8);
    });
    y += addressLines.length * 8 + 10; // Adjust Y position after address

    // Complaint Table
    doc.setFont("times", "bold");
    doc.text("Complaint Details:", leftMargin, y);
    y += 8;
    checkAvailableSpace(10);

    // Create a table for complaint details
    const complaintDetails = [
      ["Chief Complaint", chiefComplaint.chiefComplaint],
      ["Description", chiefComplaint.associatedComplaint],
      ["Investigation", chiefComplaint.investigation],
    ];

    // Create complaint details table dynamically
    const complaintTableHeight = doc.autoTable({
      startY: y,
      body: complaintDetails,
      margin: { left: leftMargin, right: rightMargin },
      styles: {
        font: "times",
        fontSize: 12,
        cellPadding: 3,
        halign: "left",
        valign: "middle",
        overflow: "linebreak",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: availableWidth - 60 },
      },
    }).lastAutoTable.finalY;

    // Update Y after complaint table
    y = complaintTableHeight + 10;

    // Function to add tables dynamically
    const addDynamicTable = (tableData, title) => {
      doc.setFont("times", "bold");
      doc.text(title, leftMargin, y);
      y += 8;
      checkAvailableSpace(10);

      const tableHeight = doc.autoTable({
        startY: y,
        body: tableData,
        margin: { left: leftMargin, right: rightMargin },
        styles: {
          font: "times",
          fontSize: 12,
          cellPadding: 3,
          halign: "left",
          valign: "middle",
          overflow: "linebreak",
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: availableWidth - 60 },
        },
      }).lastAutoTable.finalY;

      y = tableHeight + 10; // Adjust the Y position after adding the table
    };

    // Add Examination Table
    addDynamicTable(
      [
        ["Ashtasthana Pareeksha", chiefComplaint.ashtasthana],
        ["Dashavidha Pareeksha", chiefComplaint.dashavidha],
        ["Other Examination", chiefComplaint.others],
      ],
      "Examination and Diagnosis:"
    );

    // Add Treatment Table
    addDynamicTable(
      [
        ["Medicine", chiefComplaint.medicine],
        ["Panchakarma", chiefComplaint.panchakarma],
      ],
      "Treatment:"
    );

    // Follow-up Details - 3 Column Table (Date, Condition, Medicine)
    if (chiefComplaint.followup && Array.isArray(chiefComplaint.followup)) {
      // Create the table for Follow-up Details
      doc.setFont("times", "bold");
      doc.text("Follow-up Details:", leftMargin, y);
      doc.setFont("times", "normal");
      y += 8;
      checkAvailableSpace(10);

      // Create an array of follow-up data to be populated in the table
      const followupDetails = chiefComplaint.followup.map((followup) => [
        extractDate(followup.date), // Date
        followup.condition, // Condition
        followup.medicine, // Medicine
      ]);

      // Add the table with 3 columns: Date, Condition, Medicine
      doc.autoTable({
        startY: y,
        head: [["Date", "Condition", "Medicine"]],
        body: followupDetails,
        margin: { left: leftMargin, right: rightMargin },
        styles: {
          font: "times",
          fontSize: 12,
          cellPadding: 3,
          halign: "left",
          valign: "middle",
          overflow: "linebreak",
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0], // No background color
          lineWidth: 0.3, // Border width
          lineColor: [0, 0, 0], // Border color (black)
        },
        headStyles: {
          textColor: [0, 0, 0], // Set header text color to black
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0], // Optional: Ensure header background is white
          fontStyle: "bold", // Optional: Make the header text bold
        },
        columnStyles: {
          0: { cellWidth: 57 }, // Date column width (same as in Treatment)
          1: { cellWidth: availableWidth / 3 }, // Condition column width (same as in Treatment)
          2: { cellWidth: availableWidth / 3 }, // Medicine column width (same as in Treatment)
        },
      });

      // Update the Y position after the table
      y = doc.lastAutoTable.finalY + 10;
    }

    // Add page if content exceeds the available space
    checkAvailableSpace(10);

    // Add Footer immediately after content
    addFooter();

    // Generate PDF preview URL
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Set the preview URL to display in a modal or iframe
    setPreviewUrl(pdfUrl);
  } catch (error) {
    console.error("Error generating report:", error);
  }
};
