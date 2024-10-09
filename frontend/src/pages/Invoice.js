import React, { useEffect, useState } from "react";
import "../styles/Invoice.css";
import Navbar2 from "../components/Navbar2";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);

  // Fetch stored invoices from local storage on component mount
  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  }, []);

  // Handle the download of the selected invoice PDF
  const downloadPDF = (invoice) => {
    const link = document.createElement("a");
  
    // Set the href to the base64 data stored in localStorage
    link.href = invoice.pdfData;
    link.download = invoice.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar2 />
      <div className="invoice-container">
        <h2>Previously Downloaded Invoices</h2>
        {invoices.length === 0 ? (
          <p>No invoices available</p>
        ) : (
          <ul className="invoice-list">
            {invoices.map((invoice, index) => (
              <li key={index} className="invoice-item">
                <span>{invoice.filename}</span>
                <button
                  className="download-btn"
                  onClick={() => downloadPDF(invoice)}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Invoice;
