import React, { useState } from 'react';

const ItemCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="item-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
      {isHovered && (
        <div className="item-details">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Amount: {item.amount}</p>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
