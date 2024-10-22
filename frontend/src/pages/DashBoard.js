import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/DashBoard.css'; // Assuming you have styles defined

const Dashboard = () => {
    const [totalItems, setTotalItems] = useState(0);
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [items, setItems] = useState([]); // List of item names from the inventory
    const [selectedItem, setSelectedItem] = useState(''); // Selected item from dropdown
    const [itemDetails, setItemDetails] = useState({ totalPurchase: 0, totalSales: 0 }); // Purchase & Sales for the selected item
    const [error, setError] = useState(''); // To capture any errors

    // Fetch dashboard summary (total items, total purchases, total sales)
    useEffect(() => {
        const fetchDashboardSummary = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dashboard');
                const { totalItems, totalPurchase, totalSales, items } = response.data;
                setTotalItems(totalItems);
                setTotalPurchase(totalPurchase);
                setTotalSales(totalSales);
                setItems(items.map(item => item.name)); // Assuming items are objects with a `name` property
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
                setError('Error fetching dashboard summary');
            }
        };

        fetchDashboardSummary();
    }, []);

    // Fetch item details (purchase and sales quantities) when user selects an item
    const handleItemChange = async (itemName) => {
        if (itemName) {
            setSelectedItem(itemName);
            try {
                const response = await axios.get(`http://localhost:5000/api/dashboard/${itemName}`);
                const { totalPurchase, totalSales } = response.data;
                setItemDetails({ totalPurchase, totalSales }); // Set the item details
                setError(''); // Clear any previous errors
            } catch (error) {
                console.error('Error fetching item summary:', error);
                setError('Error fetching item summary');
            }
        } else {
            // Reset details if no item is selected
            setItemDetails({ totalPurchase: 0, totalSales: 0 });
        }
    };

    // Reset the selection when changing items
    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        handleItemChange(selectedValue);
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            
            {/* Display any error messages */}
            {error && <div className="error-message">{error}</div>}

            {/* Dashboard summary section */}
            <div className="summary">
                <div className="box blue-box">
                    <h2>Total Items in Inventory: {totalItems}</h2>
                </div>
                <div className="box blue-box">
                    <h2>Total Purchases: {totalPurchase}</h2>
                </div>
                <div className="box blue-box">
                    <h2>Total Sales: {totalSales}</h2>
                </div>
            </div>

            {/* Dropdown to select an item */}
            <div className="dropdown">
                <label htmlFor="itemSelect">Select Item:</label>
                <select
                    id="itemSelect"
                    value={selectedItem}
                    onChange={handleSelectChange}
                >
                    <option value="">-- Select an Item --</option>
                    {items.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            {/* Display details for the selected item */}
            {selectedItem && (
                <div className="selected-item-details">
                    <div className="box blue-box">
                        <h2>Total Purchase Quantity: {itemDetails.totalPurchase}</h2>
                    </div>
                    <div className="box blue-box">
                        <h2>Total Sales Quantity: {itemDetails.totalSales}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
