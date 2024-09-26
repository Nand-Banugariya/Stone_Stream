const Purchase = require('../models/purchasemodel'); // Ensure the correct case for the file name

exports.addPurchase = async (req, res) => {
    try {
        const { vendorName, vendorEmail, vendorMobile, paymentMethod, itemName, purchaseQuantity, amount, dateOfPurchase } = req.body;

        // Basic validation (add more as needed)
        if (!vendorName || !vendorEmail || !vendorMobile || !paymentMethod || !itemName || !purchaseQuantity || !amount || !dateOfPurchase) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Calculate remaining quantity as initially equal to purchase quantity
        const remainingQuantity = purchaseQuantity;

        // Create a new Purchase document
        const newPurchase = new Purchase({
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
