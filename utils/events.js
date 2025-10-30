// Handles event listeners for UI actions
function setupEventListeners(params) {
	const {
		mainButtons,
		sections,
		vaultBtns,
		hideOwnedCheckbox,
		addItemForm,
		searchInput,
		searchResults,
		editModal,
		editItemForm,
		modalClose,
		deleteItemBtn,
		allItems,
		itemList,
		currentFilter,
		renderItems,
		openEditModal,
		closeEditModal,
		saveVaultData,
		updateHomeMetrics,
		obtainMethodSelect,
		customObtainMethod,
	} = params;
	
	// Populate obtain methods on load
	function populateObtainMethods() {
		const existingMethods = new Set(allItems.map(item => item.obtainMethod));
		const methodOptions = [...existingMethods]
			.filter(method => method) // Remove empty methods
			.sort() // Sort alphabetically
			.map(method => `<option value="${method}">${method}</option>`)
			.join('');
		
		// Clear and repopulate the select
		obtainMethodSelect.innerHTML = `
			<option value="">Select obtain method...</option>
			${methodOptions}
			<option value="custom">+ Add new obtain method</option>
		`;
	}

	// Initial population of obtain methods
	populateObtainMethods();

	// Tab switching
	mainButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.dataset.tab;
			mainButtons.forEach((b) => b.classList.remove("active"));
			sections.forEach((s) => s.classList.remove("active"));
			btn.classList.add("active");
			document.getElementById(target).classList.add("active");
		});
	});

	// Vault sidebar
	vaultBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			vaultBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			params.currentFilter = btn.dataset.filter;
			renderItems(
				allItems,
				params.currentFilter,
				hideOwnedCheckbox,
				itemList,
				vaultBtns,
				renderItems,
				openEditModal,
				saveVaultData,
				updateHomeMetrics
			);
		});
	});

	// Handle custom filter changes (for categories)
	document.addEventListener('filterChange', (e) => {
		const { filter } = e.detail;
		params.currentFilter = filter;
		renderItems(
			allItems,
			params.currentFilter,
			hideOwnedCheckbox,
			itemList,
			vaultBtns,
			renderItems,
			openEditModal,
			saveVaultData,
			updateHomeMetrics
		);
	});

	// Hide owned checkbox
	hideOwnedCheckbox.addEventListener("change", () => {
		renderItems(
			allItems,
			params.currentFilter,
			hideOwnedCheckbox,
			itemList,
			vaultBtns,
			renderItems,
			openEditModal,
			saveVaultData,
			updateHomeMetrics
		);
	});

	function populateObtainMethods() {
		const existingMethods = new Set(allItems.map(item => item.obtainMethod));
		const methodOptions = [...existingMethods]
			.filter(method => method) // Remove empty methods
			.sort() // Sort alphabetically
			.map(method => `<option value="${method}">${method}</option>`)
			.join('');
		
		// Clear and repopulate the select
		obtainMethodSelect.innerHTML = `
			<option value="">Select obtain method...</option>
			${methodOptions}
			<option value="custom">+ Add new obtain method</option>
		`;
	}

	// Initial population of obtain methods
	populateObtainMethods();

	// Toggle custom input based on selection
	obtainMethodSelect.addEventListener("change", () => {
		const isCustom = obtainMethodSelect.value === "custom";
		customObtainMethod.style.display = isCustom ? "block" : "none";
		if (isCustom) {
			customObtainMethod.focus();
		}
	});

	// Add item form
	addItemForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(addItemForm);
		
		// Handle obtain method (either selected or custom)
		let obtainMethod = formData.get("obtainMethod");
		if (obtainMethod === "custom") {
			obtainMethod = formData.get("customObtainMethod").trim();
			if (!obtainMethod) {
				alert("Please enter a custom obtain method.");
				return;
			}
		}

		const newItem = {
			name: formData.get("name"),
			base: formData.get("base"),
			category: formData.get("category"),
			league: formData.get("league"),
			obtainMethod: obtainMethod,
			owned: formData.get("owned") === "true",
			obtainedDuringLeague: formData.get("obtainedDuringLeague") === "true",
			bosses: formData.get("bosses") === "true",
			special: formData.get("special") === "true",
			foil: formData.get("foil") === "true",
			disabled: formData.get("disabled") === "true",
			imageLink: formData.get("imageLink"),
			wikiLink: formData.get("wikiLink"),
		};
		allItems.push(newItem);
		saveVaultData(allItems);
		addItemForm.reset();
		populateObtainMethods(); // Update dropdown with new method
		customObtainMethod.style.display = "none"; // Hide custom input
		alert("Item added successfully!");
		renderItems(
			allItems,
			params.currentFilter,
			hideOwnedCheckbox,
			itemList,
			vaultBtns,
			renderItems,
			openEditModal,
			saveVaultData,
			updateHomeMetrics
		);
		updateHomeMetrics(allItems);
	});

	// Search
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.toLowerCase().trim();
		if (!query) {
			searchResults.innerHTML = "";
			return;
		}
		const results = allItems.filter(
			(item) => {
				const searchableProperties = [
					item.name,
					item.league,
					item.base,
					item.category,
					item.obtainMethod
				].map(prop => (prop || "").toLowerCase());

				// Check if query matches any of the basic properties
				const basicMatch = searchableProperties.some(prop => prop.includes(query));

				// Special handling for "disabled" search
				const isDisabledSearch = query === "disabled";
				const matchesDisabled = isDisabledSearch && item.disabled;

				return basicMatch || matchesDisabled;
			}
		);
		searchResults.innerHTML = results
			.map(
				(item) => `
      <div class="item-card${item.disabled ? ' disabled' : ''}" style="background-color:${
				item.owned ? "rgba(21,128,61,0.4)" : "rgba(153,27,27,0.4)"
			}; display:flex; align-items:flex-start;">
        <div class="item-info" style="flex:1;">
          <h4 class="item-name" data-wiki="${
						item.wikiLink
					}" style="cursor:pointer; text-decoration:underline; color:#fbbf24;">
            ${item.name}
          </h4>
          <p><strong>Base:</strong> ${item.base}</p>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>League:</strong> ${item.league}</p>
          <p><strong>Obtain:</strong> ${item.obtainMethod}</p>
          <p><strong>Boss:</strong> ${item.bosses ? "Yes" : "No"}</p>
          <p><strong>Special:</strong> ${item.special ? "Yes" : "No"}</p>
          <p><strong>Disabled:</strong> ${item.disabled ? "Yes" : "No"}</p>
        </div>
        <div class="item-image" style="flex-shrink:0; margin-left:1rem;">
          <img src="${
						item.imageLink.startsWith("http")
							? item.imageLink
							: `./Images/${item.imageLink}`
					}" 
               alt="${item.name}" 
               style="border-radius:6px;">
        </div>
      </div>`
			)
			.join("");
		searchResults.querySelectorAll(".item-name").forEach((el) => {
			el.addEventListener("click", () => {
				require("electron").shell.openExternal(el.dataset.wiki);
			});
		});
	});

	// Edit modal open/close
	modalClose.addEventListener("click", closeEditModal);
	window.addEventListener("click", (e) => {
		if (e.target === editModal) {
			closeEditModal();
		}
	});

	// Edit item form submit
	editItemForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const index = parseInt(document.getElementById("editItemIndex").value);
		
		// Handle obtain method (either selected or custom)
		let obtainMethod = document.getElementById("editObtainMethod").value;
		if (obtainMethod === "custom") {
			obtainMethod = document.getElementById("editCustomObtainMethod").value.trim();
			if (!obtainMethod) {
				alert("Please enter a custom obtain method.");
				return;
			}
		}

		allItems[index] = {
			name: document.getElementById("editName").value,
			base: document.getElementById("editBase").value,
			category: document.getElementById("editCategory").value,
			league: document.getElementById("editLeague").value,
			obtainMethod: obtainMethod,
			owned: document.getElementById("editOwned").value === "true",
			obtainedDuringLeague:
				document.getElementById("editObtainedDuringLeague").value === "true",
			bosses: document.getElementById("editBosses").value === "true",
			special: document.getElementById("editSpecial").value === "true",
			foil: document.getElementById("editFoil").value === "true",
			disabled: document.getElementById("editDisabled").value === "true",
			imageLink: document.getElementById("editImageLink").value,
			wikiLink: document.getElementById("editWikiLink").value,
		};
		saveVaultData(allItems);
		closeEditModal();
		renderItems(
			allItems,
			params.currentFilter,
			hideOwnedCheckbox,
			itemList,
			vaultBtns,
			renderItems,
			openEditModal,
			saveVaultData,
			updateHomeMetrics
		);
		updateHomeMetrics(allItems);
	});

	// Delete item
	deleteItemBtn.addEventListener("click", () => {
		if (confirm("Are you sure you want to delete this item?")) {
			const index = parseInt(document.getElementById("editItemIndex").value);
			allItems.splice(index, 1);
			saveVaultData(allItems);
			closeEditModal();
			renderItems(
				allItems,
				params.currentFilter,
				hideOwnedCheckbox,
				itemList,
				vaultBtns,
				renderItems,
				openEditModal,
				saveVaultData,
				updateHomeMetrics
			);
			updateHomeMetrics(allItems);
		}
	});
}

module.exports = { setupEventListeners };
