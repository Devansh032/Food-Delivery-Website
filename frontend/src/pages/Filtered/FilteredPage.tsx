import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FoodItem from "./../../components/FoodItem/FoodItem";
import "./../../components/FoodDisplay/FoodDisplay.css"; // Reuse existing styling

const FilteredDisplay = () => {
  const [filteredItems, setFilteredItems] = useState([]);
  const location = useLocation();
  const { query } = location.state || {};

  useEffect(() => {
    const items = localStorage.getItem("llmFilteredItems");
    if (items) {
      setFilteredItems(JSON.parse(items));
    }
  }, [query]);

  return (
    <div className="food-display" id="food-display">
      <h2>
        Showing results for:{" "}
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>{query}</span>
      </h2>

      <div className="food-display-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p>No items found for your query.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredDisplay;
