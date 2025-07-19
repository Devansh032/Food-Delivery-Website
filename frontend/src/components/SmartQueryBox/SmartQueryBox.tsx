import React, { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';


const SmartQueryBox = () => {
  const [query, setQuery] = useState("");
  const { food_list, setCartItems, addToCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      toast.success("Query is running...");
      const res = await axios.post(`${url}/api/query/`, { query });
      const { intent, filters, navigateTo, noOfItems } = res.data.data;

      console.log("🧠 LLM Response:", res.data);

      if (intent === "search" && filters) {
        console.log(`intent: ${intent}`);
        const results = await axios.post(`${url}/api/query/search`, { food_list,filters,query});
        console.log("🔍 Search Results:", results.data);

        // Store the filtered data
        localStorage.setItem("llmFilteredItems", JSON.stringify(results.data.data));
        window.dispatchEvent(new Event("llmUpdate"));

        // ✅ Redirect to filtered results page and pass query/filters
        navigate("/filtered", { state: { query, filters } });
      }
      else if (intent === "buy" && filters) {
        try {
          const response = await axios.post(`${url}/api/query/search`, {
            food_list,
            filters,
            query
          });

          const matchedItems = response.data?.data || [];
          
          if (matchedItems.length > 0) {
            const topProduct = matchedItems[0];
            const quantityToAdd = filters.noOfItems || 1;
            console.log(topProduct);
            console.log(topProduct.id);
            for (let i = 0; i < quantityToAdd; i++) {
              addToCart(topProduct.id);
            }

            navigate("/order");
          } else {
            alert("Sorry, we couldn't find a suitable item.");
          }
        } catch (error) {
          console.error("Error in buy flow:", error);
          alert("Something went wrong while processing your request.");
        }
      }

      else if (intent === "navigate") {
        navigate(navigateTo || "/");
      }

      else {
        console.warn("Unknown intent:", intent);
      }
    } catch (err) {
      console.error("❌ Query processing error:", err);
    }
  };

  return (
    <div style={{ margin: "1rem", display: "flex", justifyContent: "center" }}>
      <input
        type="text"
        placeholder="What would you like to do?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "60%",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "0.5rem 1rem",
          marginLeft: "10px",
          borderRadius: "6px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        Ask
      </button>
    </div>
  );
};

export default SmartQueryBox;
