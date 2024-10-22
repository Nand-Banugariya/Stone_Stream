const Purchase = require('../models/purchasemodel'); // Purchase model
const User = require('../models/register'); // User model (for reference if needed)

// Add a new purchase
exports.addPurchase = async (req, res) => {
    try {
        // Extract userId from the request body (coming from the frontend)
        const userId = req.body.userId;

        // Destructure the purchase details from the request body
        const { vendorName, vendorEmail, vendorMobile, paymentMethod, itemName, purchaseQuantity, amount, dateOfPurchase } = req.body;

        // Basic validation
        if (!vendorName || !vendorEmail || !vendorMobile || !paymentMethod || !itemName || !purchaseQuantity || !amount || !dateOfPurchase) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate vendorEmail format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(vendorEmail)) {
            return res.status(400).json({ message: 'Invalid vendor email format' });
        }

        // Validate vendorMobile format (assumes 10-digit number)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(vendorMobile)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        // Validate dateOfPurchase
        const purchaseDate = new Date(dateOfPurchase);
        if (isNaN(purchaseDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for dateOfPurchase' });
        }

        // Calculate remaining quantity as initially equal to purchase quantity
        const remainingQuantity = purchaseQuantity;

        // Create a new Purchase document
        const newPurchase = new Purchase({
            user_id: userId, // Link the purchase to the logged-in user
            vendorName,
            vendorEmail,
            vendorMobile,
            paymentMethod,
            itemName,
            purchaseQuantity,
            remainingQuantity, // Set remainingQuantity to purchaseQuantity initially
            amount,
            dateOfPurchase
        });

        // Save the document to the database
        await newPurchase.save();

        // Send a success response
        res.status(201).json({ message: 'Purchase added successfully', purchase: newPurchase });
    } catch (error) {
        console.error('Error adding purchase:', error); // Log the error for debugging
        // Send an error response
        res.status(500).json({ message: 'Error adding purchase', error: error.message });
    }
};
