from queryAnalyzer import analyze_query_with_llm_query , get_items_with_llm
import json
import sys

def process_query(query):
    try:
        result = analyze_query_with_llm_query(query)
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    function_name = sys.argv[1]
    query = sys.argv[2]
    filters = json.loads(sys.argv[3]) 
    food_list = json.loads(sys.argv[4]) 
    import os

    output_dir = "./temp"
    output_file = os.path.join(output_dir, "output.json")

    # ✅ Create the directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)


    if function_name == "process_query":
        output = process_query(query)
    elif function_name == "process_search_query":
        output = get_items_with_llm(food_list, filters, query)
    else:
        output = {"error": "Invalid function name"}

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

