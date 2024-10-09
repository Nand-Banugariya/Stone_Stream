import React, { useState } from "react";
import Navbar2 from "../components/Navbar2.js";
import "../styles/SalePage.css";
import axios from "axios"; // Import Axios

const SalePage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerMobile: "",
    paymentMethod: "Cash", // Default to 'cash' or adjust as necessary
    itemName: "",
    quantity: "",
    amount: "",
    dateOfSale: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(""); // For error handling

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? formatAmount(value) : value,
    });
  };

  const formatAmount = (value) => {
    const num = value.replace(/[^\d]/g, "");
    if (!num) return "";
    if (num.length < 4) return num;

    const lastThree = num.slice(-3);
    const otherParts = num.slice(0, -3);

    return (
      otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName) errors.customerName = "Customer Name is required";
    if (!formData.customerEmail) errors.customerEmail = "Customer Email is required";
    if (!formData.customerMobile) errors.customerMobile = "Customer Mobile is required";
    if (!formData.paymentMethod) errors.paymentMethod = "Payment Method is required";
    if (!formData.itemName) errors.itemName = "Item Name is required";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.dateOfSale) errors.dateOfSale = "Date of Sale is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmissionError(""); // Clear any previous error
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/sales", formData);
        console.log("Sale Data Submitted:", response.data);

        // Reset form after successful submission
        setFormData({
          customerName: "",
          customerEmail: "",
          customerMobile: "",
          paymentMethod: "cash", // Reset to default payment method
          itemName: "",
          quantity: "",
          amount: "",
          dateOfSale: "",
        });
        setFormErrors({});
        setSubmissionError(""); // Clear any previous error
      } catch (error) {
        console.error("Error submitting sale data:", error);
        if (error.response) {
          setSubmissionError(error.response.data.message || "Error submitting sale data. Please try again.");
        } else {
          setSubmissionError("Error submitting sale data. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="page-wrapper">
        <div className="sale-container">
          <h2>Sale Details</h2>
          <form onSubmit={handleSubmit} className="sale-form">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
              {formErrors.customerName && (
                <span className="error">{formErrors.customerName}</span>
              )}
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
              />
              {formErrors.customerEmail && (
                <span className="error">{formErrors.customerEmail}</span>
              )}
            </div>
            <div className="form-group">
              <label>Customer Mobile</label>
              <input
                type="text"
                name="customerMobile"
                value={formData.customerMobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
              />
              {formErrors.customerMobile && (
                <span className="error">{formErrors.customerMobile}</span>
              )}
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
              {formErrors.paymentMethod && (
                <span className="error">{formErrors.paymentMethod}</span>
              )}
            </div>
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
              {formErrors.itemName && (
                <span className="error">{formErrors.itemName}</span>
              )}
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              {formErrors.quantity && (
                <span className="error">{formErrors.quantity}</span>
              )}
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              {formErrors.amount && (
                <span className="error">{formErrors.amount}</span>
              )}
            </div>
            <div className="form-group">
              <label>Date of Sale</label>
              <input
                type="date"
                name="dateOfSale"
                value={formData.dateOfSale}
                onChange={handleChange}
                required
              />
              {formErrors.dateOfSale && (
                <span className="error">{formErrors.dateOfSale}</span>
              )}
            </div>
            <button type="submit" className="submit-btn-s">
              Submit
            </button>
            {submissionError && <span className="error">{submissionError}</span>} {/* Display submission error */}
          </form>
        </div>
      </div>
    </>
  );
};

export default SalePage;
