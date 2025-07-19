function normalize(text) {
  return text?.toLowerCase().replace(/\W+/g, '').trim() || '';
}

function getItemsWithFilters(foodList, filters, query = "") {
  const brand = normalize(filters?.brand || "");
  const category = normalize(filters?.category || "");
  const minPrice = filters?.price?.min ?? 0;
  const maxPrice = filters?.price?.max ?? 10000;

  const filteredItems = [];

  for (const item of foodList) {
    const name = normalize(item.name);
    const desc = normalize(item.description);
    const cat = normalize(item.category);
    const price = parseFloat(item.price);

    const matchesBrand =
      !brand || name.includes(brand) || desc.includes(brand);
    const matchesCategory =
      !category || cat.includes(category) || desc.includes(category);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    if (matchesBrand && matchesCategory && matchesPrice) {
      filteredItems.push({
        id: item._id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        image: item.image,
      });
    }
  }

  filteredItems.sort((a, b) => a.price - b.price);

  return filteredItems;
}

export {getItemsWithFilters};
