import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ItemCard from "../components/ItemCard.js";
import "../styles/InventoryPage.css";
import Navbar2 from "../components/Navbar2.js";

const InventoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    amount: "",  // <-- Ensure amount is part of the state
    image: "",
  });

  // Open modal to add new item
  const openModal = () => setIsModalOpen(true);
  
  // Close modal after adding item
  const closeModal = () => setIsModalOpen(false);

  // Fetch items from the backend when the component loads
  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  // Handle input change for item form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  // Handle image upload and convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemData({ ...itemData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {

  // Submit form to backend to save the item
  const handleSubmit = async () => {
    // Check if any field is empty
    if (!itemData.name || !itemData.description || !itemData.amount || !itemData.image) {
      alert("All fields are required.");
      return;
    }

  
    // Add new item to the list
    setItems([...items, itemData]);
  
    // Reset the form data and close the modal
    setItemData({ name: "", description: "", amount: "", image: "" });
    closeModal();


    try {
      // Log the itemData to see what is being sent
      console.log("Sending data:", itemData);

      // Send POST request to backend to store item data
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        const newItem = await response.json();
        // Add the new item to the state
        setItems([...items, newItem]);
        // Reset the form data and close the modal
        setItemData({ name: "", description: "", amount: "", image: "" });
        closeModal();
      } else {
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding item.");
    }

  };
  

  return (
    <>
      <Navbar2 />

      <div className="inventory-page">
        <button className="plus-button" onClick={openModal}>
          +
        </button>

        {/* Modal for adding new item */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
        >
          <h2>Add New Item</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={itemData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Item Description"
            value={itemData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={itemData.amount}
            onChange={handleInputChange}
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} required/>
          <button onClick={handleSubmit}>Submit</button>
        </Modal>

        {/* Display the list of items */}
        <div className="item-cards">
          {items.length > 0 ? (
            items.map((item, index) => (
              <ItemCard key={index} item={item} /> // Pass the whole item object to ItemCard
            ))
          ) : (
            <p>No items available.</p>
          )}
        </div>
      </div>
    </>
  );
};
}

export default InventoryPage;
