import React, { useState } from 'react';
import axios from 'axios';
import Navbar2 from '../components/Navbar2.js';
import '../styles/PurchasePage.css';

const PurchasePage = () => {
    // State for form data
    const [formData, setFormData] = useState({
        vendorName: '',
        vendorEmail: '',
        vendorMobile: '',
        paymentMethod: '',
        itemName: '',
        purchaseQuantity: '',
        amount: '',
        dateOfPurchase: ''
    });

    // State for form errors and submission messages
    const [formErrors, setFormErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState('');

    // Handle input changes and update state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate form data
    const validateForm = () => {
        const errors = {};
        if (!formData.vendorName) errors.vendorName = 'Vendor Name is required';
        if (!formData.vendorEmail) errors.vendorEmail = 'Vendor Email is required';
        if (!formData.vendorMobile || !/^\d{10}$/.test(formData.vendorMobile)) {
            errors.vendorMobile = 'Vendor Mobile is required and must be a 10-digit number';
        }
        if (!formData.paymentMethod) errors.paymentMethod = 'Payment Method is required';
        if (!formData.itemName) errors.itemName = 'Item Name is required';
        if (!formData.purchaseQuantity || isNaN(formData.purchaseQuantity) || formData.purchaseQuantity <= 0) {
            errors.purchaseQuantity = 'Quantity is required and must be a positive number';
        }
        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
            errors.amount = 'Amount is required and must be a positive number';
        }
        if (!formData.dateOfPurchase) errors.dateOfPurchase = 'Date of Purchase is required';
        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        } else {
            try {
                // Send data to backend using axios
                const response = await axios.post('http://localhost:5000/api/purchases', formData);
                console.log('Response from server:', response.data);
                setSubmitMessage('Form submitted successfully!');
                
                // Reset form fields after successful submission
                setFormData({
                    vendorName: '',
                    vendorEmail: '',
                    vendorMobile: '',
                    paymentMethod: '',
                    itemName: '',
                    purchaseQuantity: '',
                    amount: '',
                    dateOfPurchase: ''
                });
                setFormErrors({});
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitMessage('An error occurred while submitting the form. Check console for details.');
            }
        }
    };

    return (
        <div>
            <Navbar2 />
            <div className="purchase-page-wrapper">
                <div className="purchase-container">
                    <h2>Purchase Details</h2>
                    <form className="purchase-form" onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="form-group">
                            <label>Vendor Name</label>
                            <input 
                                type="text" 
                                name="vendorName" 
                                value={formData.vendorName} 
                                onChange={handleChange} 
                                required 
                            />
                            {formErrors.vendorName && <span className="error">{formErrors.vendorName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Vendor Email</label>
                            <input 
                                type="email" 
                                name="vendorEmail" 
                                value={formData.vendorEmail} 
                                onChange={handleChange} 
                                required 
                            />
                            {formErrors.vendorEmail && <span className="error">{formErrors.vendorEmail}</span>}
                        </div>

                        <div className="form-group">
                            <label>Vendor Mobile No.</label>
                            <input 
                                type="tel" 
                                name="vendorMobile" 
                                value={formData.vendorMobile} 
                                onChange={handleChange} 
                                pattern="[0-9]{10}" 
                                required 
                            />
                            {formErrors.vendorMobile && <span className="error">{formErrors.vendorMobile}</span>}
                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select 
                                name="paymentMethod" 
                                value={formData.paymentMethod} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="" disabled>Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="online">Online</option>
                            </select>
                            {formErrors.paymentMethod && <span className="error">{formErrors.paymentMethod}</span>}
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
                            {formErrors.itemName && <span className="error">{formErrors.itemName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input 
                                type="number" 
                                name="purchaseQuantity" 
                                value={formData.purchaseQuantity} 
                                onChange={handleChange} 
                                required 
                            />
                            {formErrors.purchaseQuantity && <span className="error">{formErrors.purchaseQuantity}</span>}
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
                            {formErrors.amount && <span className="error">{formErrors.amount}</span>}
                        </div>

                        <div className="form-group">
                            <label>Date of Purchase</label>
                            <input 
                                type="date" 
                                name="dateOfPurchase" 
                                value={formData.dateOfPurchase} 
                                onChange={handleChange} 
                                required 
                            />
                            {formErrors.dateOfPurchase && <span className="error">{formErrors.dateOfPurchase}</span>}
                        </div>

                        <button type="submit" className="submit-btn-s">Submit</button>
                        {submitMessage && <div className="submit-message">{submitMessage}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;
