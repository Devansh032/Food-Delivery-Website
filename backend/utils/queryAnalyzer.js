import fetch from 'node-fetch';
import fs from 'fs';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.LLAMA_API_KEY;

export async function analyzeQueryWithLLM(query) {
  const prompt = `
You are an intelligent assistant for a food or product delivery application.

You will be given a natural language query from the user, such as:
- "Show me trending Nike shoes between 2500 and 5000"
- "I want to buy a large pizza under ₹300"
- "Find me a product which is used for making chapati"
- "Take me to the cart"

Your job is to extract a JSON structure with **intent**, **filters**, and **navigation path**, ALWAYS using this exact format:

{
"intent": "<search(see,list)|buy|navigate>",
"filters": {
    "brand": "<brand_name_or_empty_string>",
    "category": "<specific_product_or_usecase_or_empty_string>",
    "price": {
        "min": <min_price_or_0>,
        "max": <max_price_or_10000>
    },
    "sort": "<sort_type_or_empty_string>",
    "noOfItems" : <acc_to_the_query_or_1>
},
"navigateTo": "<frontend_path_or_empty_string>"
}

**IMPORTANT Instructions**:
- Prefer **specific** product types over generic ones (e.g., use "category": "chapati maker" instead of "kitchen appliances").
- If user mentions a function or use-case (e.g., "used for making chapati"), extract the **most relevant product category**.
- Even if filters or path are missing from the query, include them with empty or zero values.
- Always respond with a valid JSON object.

Query: ${query}
`;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    let result = JSON.parse(data.choices[0].message.content);

    // Ensure full structure is returned, with empty defaults if needed
    result = {
      intent: result.intent || "",
      filters: {
        brand: result.filters?.brand || "",
        category: result.filters?.category || "",
        price: {
          min: result.filters?.price?.min ?? 0,
          max: result.filters?.price?.max ?? 10000
        },
        sort: result.filters?.sort || "",
        noOfItems: result.filters?.noOfItems ?? 1
      },
      navigateTo: result.navigateTo || ""
    };

    fs.writeFileSync('temp_query_result.json', JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    const errorData = {
      intent: "",
      filters: {
        brand: "",
        category: "",
        price: { min: 0, max: 10000 },
        sort: "",
        noOfItems: ""
      },
      navigateTo: "",
      error: String(e)
    };
    fs.writeFileSync('temp_query_result.json', JSON.stringify(errorData, null, 2));
    return errorData;
  }
}

export async function getItemsWithLLM(foodList, filters, query) {
  const prompt = `
You are a smart shopping assistant helping users find products from a given list.

User Query:
"${query}"

Filters to apply:
${JSON.stringify(filters)}

Product Catalog (up to 20 items):
${JSON.stringify(foodList.slice(0, 20))}

Instructions:
1. Understand the intent behind the query.
2. Apply the following filters:
   - brand (partial match on product name)
   - category (match item.category with filters.category — use fuzzy or partial matching like "salad" vs "salads")
   - price range (min ≤ item.price ≤ max)
3. Select items that match the filters and are relevant to the query based on:
   - name
   - description
   - category
   - price
4. Return only a JSON array of selected items using **exactly this structure**:

[
  {
    "id": "item_id_from_food_list",
    "name": "Product Name",
    "category": "Product Category",
    "description": "Relevant Description",
    "price": ProductPrice
  },
  ...
]

DO NOT include any extra explanation or wrapping object — just return a valid JSON array.
`;

  const body = {
    model: "llama-3.3-70b-8192",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" }
  };

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    let resultJson = JSON.parse(data.choices[0].message.content);

    if (Array.isArray(resultJson)) {
      return resultJson;
    } else if (typeof resultJson === "object" && resultJson.items) {
      return resultJson.items;
    } else {
      return [];
    }
  } catch (e) {
    console.error("LLM error:", e);
    return [];
  }
}