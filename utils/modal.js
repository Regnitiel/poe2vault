// Handles opening and closing the edit modal
function populateEditObtainMethods(allItems, selectedMethod) {
	const obtainMethodSelect = document.getElementById("editObtainMethod");
	const existingMethods = new Set(allItems.map(item => item.obtainMethod));
	const methodOptions = [...existingMethods]
		.filter(method => method) // Remove empty methods
		.sort() // Sort alphabetically
		.map(method => `<option value="${method}"${method === selectedMethod ? ' selected' : ''}>${method}</option>`)
		.join('');
	
	obtainMethodSelect.innerHTML = `
		<option value="">Select obtain method...</option>
		${methodOptions}
		<option value="custom">+ Add new obtain method</option>
	`;
}

function openEditModal(index, allItems) {
	const item = allItems[index];
	document.getElementById("editItemIndex").value = index;
	document.getElementById("editName").value = item.name;
	document.getElementById("editBase").value = item.base;
	document.getElementById("editCategory").value = item.category;
	document.getElementById("editLeague").value = item.league;
	document.getElementById("editDisabled").value = (item.disabled || false).toString();
	
	// Setup obtain method dropdown
	populateEditObtainMethods(allItems, item.obtainMethod);
	const editCustomObtainMethod = document.getElementById("editCustomObtainMethod");
	editCustomObtainMethod.value = "";
	editCustomObtainMethod.style.display = "none";
	
	document.getElementById("editOwned").value = item.owned.toString();
	document.getElementById("editObtainedDuringLeague").value =
		item.obtainedDuringLeague.toString();
	document.getElementById("editBosses").value = item.bosses.toString();
	document.getElementById("editSpecial").value = item.special.toString();
	document.getElementById("editFoil").value = (item.foil || false).toString();
	document.getElementById("editImageLink").value = item.imageLink;
	document.getElementById("editWikiLink").value = item.wikiLink;
	document.getElementById("editModal").style.display = "block";

	// Add change event listener for obtain method dropdown
	const editObtainMethodSelect = document.getElementById("editObtainMethod");
	editObtainMethodSelect.addEventListener("change", () => {
		const isCustom = editObtainMethodSelect.value === "custom";
		editCustomObtainMethod.style.display = isCustom ? "block" : "none";
		if (isCustom) {
			editCustomObtainMethod.focus();
		}
	});
}

function closeEditModal() {
	document.getElementById("editModal").style.display = "none";
}

module.exports = { openEditModal, closeEditModal };
