import { analyzeQueryWithLLM, getItemsWithLLM } from '../utils/queryAnalyzer.js';
import { getItemsWithFilters } from "../utils/getItemsWithFilters.js";

const executeQuery = async (req, res) => {
  try {
    const query = req.body.query;
    const filters = req.body.filters || {};
    const food_list = req.body.food_list || [];

    const result = await analyzeQueryWithLLM(query);
    res.json({
      success: true,
      message: "Query successfully executed",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const searchQuery = async (req, res) => {
  try {
    const query = req.body.query;
    const filters = req.body.filters || {};
    const food_list = req.body.food_list || [];

    const result = await getItemsWithLLM(food_list, filters, query);
    if (result && result.length > 0) {
      res.json({
        success: true,
        message: "Query successfully executed",
        data: result,
      });
    } else {
      // fallback
      const filteredItems = getItemsWithFilters(food_list, filters, query);
      res.json({
        success: true,
        message: "Fallback filtering used due to empty LLM result",
        data: filteredItems,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { executeQuery, searchQuery };