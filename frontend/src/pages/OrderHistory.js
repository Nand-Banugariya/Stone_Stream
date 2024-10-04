import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/OrderHistory.css';
import Navbar2 from '../components/Navbar2';

const OrderHistory = () => {
  const [historyType, setHistoryType] = useState('purchase'); // Default to 'purchase'
  const [historyData, setHistoryData] = useState([]);
  const [startDate, setStartDate] = useState(null); // Date filter
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [entriesPerPage] = useState(7); // Change entries per page to 7
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [selectedEntries, setSelectedEntries] = useState([]); // To track selected rows

  // Fetch purchase or sales history based on the selected history type
  const fetchHistory = async () => {
    try {
      const url =
        historyType === 'purchase'
          ? 'http://localhost:5000/api/orders/purchase-history' // Purchase API endpoint
          : 'http://localhost:5000/api/orders/sales-history'; // Sales API endpoint

      const response = await axios.get(url);

      console.log('Response Data:', response.data); // Debugging log to check data

      // Extract relevant data
      const dataToDisplay = historyType === 'purchase'
        ? response.data.purchases.map(item => ({
            _id: item._id,
            vendorName: item.vendorName,
            itemName: item.itemName,
            purchaseQuantity: item.purchaseQuantity,
            remainingQuantity: item.remainingQuantity, // Keep remainingQuantity for purchases
            amount: item.amount,
            date: new Date(item.dateOfPurchase), // Ensure date is in Date object format
          }))
        : response.data.sales.map(item => ({
            _id: item._id,
            customerName: item.customerName,
            itemName: item.itemName,
            quantity: item.quantity,
            amount: item.amount,
            date: new Date(item.date), // Use the correct field for sales date
          })); // Only keep relevant fields for sales

      // Filter data based on the selected start date
      const filteredData = filterByDate(dataToDisplay);
      setHistoryData(filteredData);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Filter history data by the selected date
  const filterByDate = (data) => {
    if (!startDate) return data; // If no date is selected, return all data
    return data.filter((item) => {
      const itemDate = new Date(item.date); // Ensure item date is a Date object
      // Compare only the date part (ignoring time)
      return itemDate.toDateString() === startDate.toDateString();
    });
  };

  // Filter history data by the search query
  const filterBySearch = (data) => {
    if (!searchQuery) return data; // If no search query, return all data
    return data.filter((item) => {
      const nameToSearch = historyType === 'purchase' ? item.vendorName : item.customerName;
      return (
        nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Fetch history whenever history type or start date changes
  useEffect(() => {
    fetchHistory();
  }, [historyType, startDate]);

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  
  // Apply search filter before slicing for pagination
  const filteredData = filterBySearch(historyData);
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Handler for changing pages
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle checkbox selection
  const handleSelectEntry = (entry) => {
    const isSelected = selectedEntries.find(item => item._id === entry._id);
    if (isSelected) {
      // Remove from selected if already selected
      setSelectedEntries(selectedEntries.filter(item => item._id !== entry._id));
    } else {
      // Add to selected entries
      setSelectedEntries([...selectedEntries, entry]);
    }
  };

  // Generate PDF with selected entries
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Order History Report', 20, 20);

    const dataForPDF = selectedEntries.map(item => [
      historyType === 'purchase' ? item.vendorName : item.customerName,
      item.itemName,
      historyType === 'purchase' ? item.purchaseQuantity : item.quantity,
      item.amount,
      new Date(item.date).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [[
        historyType === 'purchase' ? 'Vendor Name' : 'Customer Name',
        'Item Name',
        'Quantity',
        'Amount',
        'Date'
      ]],
      body: dataForPDF,
    });

    doc.save('order-history.pdf');
  };

  return (
    <>
    <Navbar2 />
    
    <div className="container">
      <h2>Order History</h2>

      {/* Date Picker for filtering by date */}
      <div className="date-filter">
        <label>Filter by Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Select a date"
          isClearable
        />
      </div>

      {/* Search bar for filtering by customer name or item name */}
      <div className="search-bar">
        <label>Search: </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          placeholder="Search by Customer/Item Name"
        />
      </div>

      {/* Buttons to switch between Purchase and Sales history */}
      <div className="button-group">
        <button
          onClick={() => {
            setHistoryType('purchase');
            setCurrentPage(1); // Reset to first page on type change
          }}
          className={historyType === 'purchase' ? 'active' : ''}
        >
          Purchase History
        </button>
        <button
          onClick={() => {
            setHistoryType('sales');
            setCurrentPage(1); // Reset to first page on type change
          }}
          className={historyType === 'sales' ? 'active' : ''}
        >
          Sales History
        </button>
      </div>

      {/* Table to display the history data */}
      <div className="history-list">
        {currentEntries.length === 0 ? (
          <p>No history available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Select</th> {/* Added for checkboxes */}
                <th>{historyType === 'purchase' ? 'Vendor Name' : 'Customer Name'}</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((item) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectEntry(item)}
                      checked={selectedEntries.find(selected => selected._id === item._id) || false}
                    />
                  </td>
                  <td>{historyType === 'purchase' ? item.vendorName : item.customerName}</td>
                  <td>{item.itemName}</td>
                  <td>{historyType === 'purchase' ? item.purchaseQuantity : item.quantity}</td>
                  <td>{item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate PDF button */}
      <button
        className="generate-pdf"
        onClick={generatePDF}
        disabled={selectedEntries.length === 0}
      >
        Generate PDF
      </button>

      {/* Pagination buttons */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default OrderHistory;
