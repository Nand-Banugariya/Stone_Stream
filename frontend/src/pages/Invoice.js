import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar2 from "../components/Navbar2";
import { FaFileDownload } from "react-icons/fa";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  }, []);

  const downloadPDF = (invoice) => {
    const link = document.createElement("a");
    link.href = invoice.pdfData;
    link.download = invoice.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageLayout>
      <Navbar2 />
      <ContentWrapper>
        <Header>Previously Downloaded Invoices</Header>
        {invoices.length === 0 ? (
          <NoInvoicesMessage>No invoices available</NoInvoicesMessage>
        ) : (
          <InvoiceList>
            {invoices.map((invoice, index) => (
              <InvoiceItem key={index}>
                <InvoiceFileName>{invoice.filename}</InvoiceFileName>
                <DownloadButton onClick={() => downloadPDF(invoice)}>
                  <FaFileDownload />
                  Download
                </DownloadButton>
              </InvoiceItem>
            ))}
          </InvoiceList>
        )}
      </ContentWrapper>
    </PageLayout>
  );
};

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px; // Adjust based on your Navbar2 width
  background-color: #f5f7fa;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
`;

const NoInvoicesMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const InvoiceList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InvoiceItem = styled.li`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
`;

const InvoiceFileName = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default Invoice;