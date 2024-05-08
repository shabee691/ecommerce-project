let preinputvalue = "";

async function handleSearchInput(event) {
  const partialInput = document.getElementById("searchInput").value;
  if (event.key === "Enter"||event.type === 'click') {
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
