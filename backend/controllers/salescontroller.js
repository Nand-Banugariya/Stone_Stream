const Sale = require('../models/salesmodel'); // Import your Sale model
const Vendor = require('../models/purchasemodel'); // Import your Vendor model

exports.addSale = async (req, res) => {
  try {
    const { Customer_Name, Customer_Email, Customer_Mobile, Payment_Method, Item_Name, Quantity, Amount, Date: saleDate } = req.body;

    // Ensure all required fields are provided
    if (!Customer_Name || !Customer_Email || !Item_Name || !Quantity || !Amount || !Customer_Mobile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate the quantity, amount, and date
    const parsedQuantity = parseInt(Quantity, 10);
    const parsedAmount = parseFloat(Amount);
    const parsedDate = saleDate ? new Date(saleDate) : new Date(); // Use the provided date or the current date

    if (isNaN(parsedQuantity) || isNaN(parsedAmount) || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid data format for quantity, amount, or date' });
    }

    // Find vendor records for the item being sold, skipping entries with 0 quantity
    let remainingQuantity = parsedQuantity;
    const vendors = await Vendor.find({ itemName: Item_Name, remainingQuantity: { $gt: 0 } }).sort({ dateOfPurchase: 1 }); // Sort by date to use oldest stock first

    // Check if there's sufficient quantity available in total
    const totalAvailableQuantity = vendors.reduce((acc, vendor) => acc + vendor.remainingQuantity, 0);
    if (totalAvailableQuantity < remainingQuantity) {
      return res.status(400).json({ message: 'Insufficient quantity available in vendor stock' });
    }

    // Subtract quantity from vendor records
    for (const vendor of vendors) {
      if (remainingQuantity <= 0) break; // If remaining quantity is zero, stop updating

      if (vendor.remainingQuantity >= remainingQuantity) {
        vendor.remainingQuantity -= remainingQuantity;
        remainingQuantity = 0; // All quantity has been accounted for
      } else {
        remainingQuantity -= vendor.remainingQuantity;
        vendor.remainingQuantity = 0; // Vendor's stock depleted
      }

      await vendor.save(); // Save updated vendor record
    }

    // Create and save the sale data in the Sale collection
    const sale = new Sale({
      customerName: Customer_Name,
      customerEmail: Customer_Email,
      customerMobile: Customer_Mobile, // Include this field in the Sale model as well
      paymentMethod: Payment_Method,
      itemName: Item_Name,
      quantity: parsedQuantity,
      amount: parsedAmount,
      date: parsedDate
    });

    await sale.save();

    // Update remaining quantity in Vendor collection
    const vendors = await Vendor.find({ itemName: Item_Name, remainingQuantity: { $gt: 0 } }).sort({ dateOfPurchase: 1 });

    let remainingQuantityToSubtract = parsedQuantity;

    for (let vendor of vendors) {
      if (vendor.remainingQuantity >= remainingQuantityToSubtract) {
        vendor.remainingQuantity -= remainingQuantityToSubtract;
        await vendor.save();
        break;
      } else {
        remainingQuantityToSubtract -= vendor.remainingQuantity;
        vendor.remainingQuantity = 0;
        await vendor.save();
      }
    }

    res.status(201).json({ message: 'Sale added successfully', sale });
  } catch (error) {
    console.error('Error adding sale data:', error.message, error.stack);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};
