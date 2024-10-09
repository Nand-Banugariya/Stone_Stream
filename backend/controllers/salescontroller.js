const Sale = require('../models/salesmodel'); // Import your Sale model
const Vendor = require('../models/purchasemodel'); // Import your Vendor model

exports.addSale = async (req, res) => {
  try {
    const { Customer_Name, Customer_Email, Customer_Mobile, Payment_Method, Item_Name, Quantity, Amount, Date } = req.body;

    const parsedDate = new Date(Date);
    const parsedQuantity = parseInt(Quantity, 10);
    const parsedAmount = parseFloat(Amount);

    // Create a new sale object
    const sale = new Sale({
      customerName: Customer_Name,
      customerEmail: Customer_Email,
      customerMobile: Customer_Mobile,
      paymentMethod: Payment_Method,
      itemName: Item_Name,
      quantity: parsedQuantity,
      amount: parsedAmount,
      date: parsedDate,
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
