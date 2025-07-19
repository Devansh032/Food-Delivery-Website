import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getItemsWithFilters } from "../utils/getItemsWithFilters.js";


const executeQuery = async (req, res) => {
    console.log("✅ Request reached /executeQuery controller!");

    try {
        const query = req.body.query;
        const filters = req.body.filters || {};
        const food_list = req.body.food_list || [];
        console.log("🔍 Query received:", query);

        const scriptPath = process.env.SCRIPT_PATH;

        const output_file = "./temp/output.json";


        const process_query = spawn("python", [scriptPath, "process_query", query, JSON.stringify(filters), JSON.stringify(food_list)]);

        process_query.on("close", async (code) => {
            console.log(`🐍 Python process exited with code ${code}`);
            try {
                if (!fs.existsSync(output_file)) {
                    return res.status(500).json({ success: false, message: "Output file not found" });
                }

                const fileContent = fs.readFileSync(output_file, "utf-8");
                const result = JSON.parse(fileContent);

                res.json({
                    success: true,
                    message: "Query successfully executed",
                    data: result,
                });

                // Optionally, delete the file after reading it
                fs.unlinkSync(output_file);

            } catch (error) {
                console.error("❌ Failed to read/parse output JSON:", error);
                res.status(500).json({ success: false, message: "Failed to load results" });
            }
        });

        process_query.stderr.on("data", (err) => {
            console.error("❌ Python Error:", err.toString());
        });

    } catch (err) {
        console.error("❌ Node server error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const searchQuery = async (req, res) => {
    console.log("✅ Request reached /search query controller!");

    try {
        const query = req.body.query;
        const filters = req.body.filters || {};
        const food_list = req.body.food_list || [];

        const scriptPath = process.env.SCRIPT_PATH;
        const output_file = "./temp/output.json"


        const pyProcess = spawn("python", [
            scriptPath,
            "process_search_query",
            query,
            JSON.stringify(filters),
            JSON.stringify(food_list),
        ]);

        pyProcess.on("close", async (code) => {
            console.log(`🐍 Python process exited with code ${code}`);
            try {
                if (!fs.existsSync(output_file)) {
                    return res.status(500).json({ success: false, message: "Output file not found" });
                }

                const fileContent = fs.readFileSync(output_file, "utf-8");
                const result = JSON.parse(fileContent);
                if (result?.data?.data && result.data.data.length > 0) {
                    res.json({
                        success: true,
                        message: "Query successfully executed",
                        data: result.data,
                    });
                } else {
                    console.log("⚠️ No LLM results. Using fallback filtering logic...");

                    // Fallback: use JS-based filtering
                    const filteredItems = getItemsWithFilters(food_list, filters, query);

                    res.json({
                        success: true,
                        message: "Fallback filtering used due to empty LLM result",
                        data: filteredItems,
                    });
                }
                // Optionally, delete the file after reading it
                fs.unlinkSync(output_file);

            } catch (error) {
                console.error("❌ Failed to read/parse output JSON:", error);
                res.status(500).json({ success: false, message: "Failed to load results" });
            }
        });

        pyProcess.stderr.on("data", (err) => {
            console.error("❌ Python Error:", err.toString());
        });

    } catch (err) {
        console.error("❌ Node server error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { executeQuery , searchQuery };
