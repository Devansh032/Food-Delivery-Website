import os
from groq import Groq
import json

def analyze_query_with_llm_query(query: str) -> dict:
    API_KEY = os.getenv("LLAMA_API_KEY")
    temp_file = "temp_query_result.json"

    prompt = f"""
    You are an intelligent assistant for a food or product delivery application.

    You will be given a natural language query from the user, such as:
    - "Show me trending Nike shoes between 2500 and 5000"
    - "I want to buy a large pizza under ₹300"
    - "Find me a product which is used for making chapati"
    - "Take me to the cart"

    Your job is to extract a JSON structure with **intent**, **filters**, and **navigation path**, ALWAYS using this exact format:

    {{
    "intent": "<search(see,list)|buy|navigate>",
    "filters": {{
        "brand": "<brand_name_or_empty_string>",
        "category": "<specific_product_or_usecase_or_empty_string>",
        "price": {{
        "min": <min_price_or_0>,
        "max": <max_price_or_10000>
        }},
        "sort": "<sort_type_or_empty_string>",
        "noOfItems" : <acc_to_the_query_or_1>,
    }},
    "navigateTo": "<frontend_path_or_empty_string>"
    }}

    **IMPORTANT Instructions**:
    - Prefer **specific** product types over generic ones (e.g., use `"category": "chapati maker"` instead of `"kitchen appliances"`).
    - If user mentions a function or use-case (e.g., "used for making chapati"), extract the **most relevant product category**.
    - Even if filters or path are missing from the query, include them with empty or zero values.
    - Always respond with a valid JSON object.

    Query: {query}
"""

    try:
        client = Groq(api_key=API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.2,
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)

        # Ensure full structure is returned, with empty defaults if needed
        result = {
            "intent": result.get("intent", ""),
            "filters": {
                "brand": result.get("filters", {}).get("brand", ""),
                "category": result.get("filters", {}).get("category", ""),
                "price": {
                    "min": result.get("filters", {}).get("price", {}).get("min", 0),
                    "max": result.get("filters", {}).get("price", {}).get("max", 10000)
                },
                "sort": result.get("filters", {}).get("sort", ""),
                "noOfItems": result.get("filters", {}).get("noOfItems", 1)  # Default to 1 if not present
            },
            "navigateTo": result.get("navigateTo", "")
        }


        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False)

        return result

    except Exception as e:
        error_data = {
            "intent": "",
            "filters": {
                "brand": "",
                "category": "",
                "price": { "min": 0, "max": 10000 },
                "sort": "",
                "noOfitems" : "",
            },
            "navigateTo": "",
            "error": str(e)
        }
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(error_data, f, ensure_ascii=False)

        return error_data


def get_items_with_llm(food_list: list, filters: dict, query: str) -> list:
    API_KEY = os.getenv("LLAMA_API_KEY")

    prompt = f"""
You are a smart shopping assistant helping users find products from a given list.

User Query:
"{query}"

Filters to apply:
{json.dumps(filters)}

Product Catalog (up to 20 items):
{json.dumps(food_list[:20])}

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
  {{
    "id": "item_id_from_food_list",
    "name": "Product Name",
    "category": "Product Category",
    "description": "Relevant Description",
    "price": ProductPrice
  }},
  ...
]

DO NOT include any extra explanation or wrapping object — just return a valid JSON array.
"""

    try:
        client = Groq(api_key=API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        result_json = json.loads(response.choices[0].message.content)

        if isinstance(result_json, list):
            return result_json
        elif isinstance(result_json, dict) and "items" in result_json:
            return result_json["items"]
        else:
            return []

    except Exception as e:
        print("LLM error:", e)
        return []
