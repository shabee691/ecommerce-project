let preinputvalue = "";

async function handleSearchInput(event) {
  const partialInput = document.getElementById("searchInput").value;
  if (event.key === "Enter") {
    window.location.href = `/shop?search=${partialInput}`;
  } else {
    if (partialInput !== preinputvalue) {
      try {
        const response = await fetch(`/search?input=${partialInput}`);
        const data = await response.json();

        displayAutocompleteSuggestions(data.suggestions);
        preinputvalue = partialInput;
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    }
  }
}
document.getElementById("applyFiltersBtn").addEventListener("click", function () {
  // Get selected category
  const selectedCategory = document.querySelector('input[name="category"]:checked');
  const categoryValue = selectedCategory ? selectedCategory.value : null;

  // Get selected price filter
  const selectedPriceFilter = document.querySelector('input[name="price-filter"]:checked');
  const priceFilterValue = selectedPriceFilter ? selectedPriceFilter.value : null;

  // Get product name filter value

  // Construct filters object
  const filters = {
      category: categoryValue,
      priceFilter: priceFilterValue,
    
  };

  // Construct query string
  const queryString = Object.keys(filters)
      .filter((key) => filters[key] !== null && filters[key] !== "")
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");

  // Construct URL
  const url = `/shop?${queryString}`;

  // Redirect user
  window.location.href = url;
});
