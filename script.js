const fs = require("fs");
const path = require("path");
const { shell } = require("electron");

// ===== CONFIG =====
const vaultFilePath = path.join(
	process.env.HOME || process.env.USERPROFILE,
	"Library/CloudStorage/GoogleDrive-b.morosan94@gmail.com",
	"My Drive",
	"POE",
	"vaultData.json"
);

// ===== DOM ELEMENTS =====
let allItems = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
	const mainButtons = document.querySelectorAll(".tab-btn");
	const sections = document.querySelectorAll("main > section");
	const itemList = document.getElementById("itemList");
	const vaultBtns = document.querySelectorAll(".vault-btn");
	const hideOwnedCheckbox = document.getElementById("hideOwnedCheckbox");
	const addItemForm = document.getElementById("addItemForm");
	const searchInput = document.getElementById("searchInput");
	const searchResults = document.getElementById("searchResults");
	const editModal = document.getElementById("editModal");
	const editItemForm = document.getElementById("editItemForm");
	const modalClose = document.querySelector(".modal-close");
	const deleteItemBtn = document.getElementById("deleteItemBtn");

	// ===== LOAD / SAVE =====
	function loadVaultData() {
		try {
			allItems = JSON.parse(fs.readFileSync(vaultFilePath, "utf8"));
		} catch (err) {
			console.error("Failed to load vaultData.json", err);
			itemList.innerHTML =
				"<p>Failed to load items. Make sure the JSON file exists in your Google Drive folder.</p>";
		}
	}

	function saveVaultData() {
		try {
			fs.writeFileSync(vaultFilePath, JSON.stringify(allItems, null, 2));
		} catch (err) {
			console.error("Failed to save vaultData.json", err);
		}
	}

	// ===== TAB SWITCHING =====
	mainButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.dataset.tab;
			mainButtons.forEach((b) => b.classList.remove("active"));
			sections.forEach((s) => s.classList.remove("active"));
			btn.classList.add("active");
			document.getElementById(target).classList.add("active");
		});
	});

	// ===== RENDER VAULT =====
	// ======== RENDER ITEMS (VAULT) ========
	function renderItems(leagueFilter = "all") {
		let filtered = allItems;

		// Filter by league / special / bosses
		if (leagueFilter !== "all") {
			if (leagueFilter === "Bosses")
				filtered = filtered.filter((i) => i.bosses);
			else if (leagueFilter === "Special")
				filtered = filtered.filter((i) => i.special);
			else filtered = filtered.filter((i) => i.league === leagueFilter);
		}

		// Filter out owned items if checkbox is checked
		if (hideOwnedCheckbox.checked) {
			filtered = filtered.filter((i) => !i.owned);
		}

		// Group items by category
		const itemsByCategory = {};
		filtered.forEach((item) => {
			if (!itemsByCategory[item.category]) {
				itemsByCategory[item.category] = [];
			}
			itemsByCategory[item.category].push(item);
		});

		// Sort categories alphabetically
		const sortedCategories = Object.keys(itemsByCategory).sort();

		// Build HTML with category sections
		let html = "";
		sortedCategories.forEach((category) => {
			html += `<div class="category-section">
        <h3 class="category-title">${category}</h3>
        <div class="category-items">`;

			itemsByCategory[category].forEach((item) => {
				const idx = allItems.indexOf(item);
				// Determine background color
				let bgColor;
				if (item.foil) {
					bgColor = "rgba(251,191,36,0.3)"; // faded yellow for foil
				} else if (item.obtainedDuringLeague) {
					bgColor = "rgba(59,130,246,0.4)"; // blue if obtainedDuringLeague
				} else if (item.owned) {
					bgColor = "rgba(21,128,61,0.4)"; // green if owned
				} else {
					bgColor = "rgba(153,27,27,0.4)"; // red if not owned
				}

				html += `
          <div class="item-card" style="background-color: ${bgColor}; display:flex; align-items:flex-start;">
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
              <div class="item-buttons">
                <button class="owned-btn" data-index="${idx}">${
					item.owned ? "Owned" : "Not owned"
				}</button>
                <button class="obtained-btn" data-index="${idx}">Obtained During League</button>
                <button class="foil-btn" data-index="${idx}">${
					item.foil ? "Foil ✓" : "Foil"
				}</button>
                <button class="edit-btn" data-index="${idx}">Edit</button>
              </div>
            </div>
            <div class="item-image" style="flex-shrink:0; margin-left:1rem;">
              <img src="${item.imageLink}" alt="${
					item.name
				}" style="border-radius:6px;">
            </div>
          </div>`;
			});

			html += `</div></div>`; // Close category-items and category-section
		});

		itemList.innerHTML = html;

		// ===== OWNED / NOT OWNED BUTTON =====
		document.querySelectorAll(".owned-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const idx = btn.dataset.index;
				allItems[idx].owned = allItems[idx].owned ? false : true;
				allItems[idx].obtainedDuringLeague = false; // reset obtainedDuringLeague
				saveVaultData();
				renderItems(currentFilter);
				updateHomeMetrics();
			});
		});

		// ===== OBTAINED DURING LEAGUE BUTTON =====
		document.querySelectorAll(".obtained-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const idx = btn.dataset.index;
				allItems[idx].owned = true;
				allItems[idx].obtainedDuringLeague = true;
				saveVaultData();
				renderItems(currentFilter);
				updateHomeMetrics();
			});
		});

		// ===== FOIL BUTTON =====
		document.querySelectorAll(".foil-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const idx = btn.dataset.index;
				allItems[idx].foil = allItems[idx].foil ? false : true;
				saveVaultData();
				renderItems(currentFilter);
				updateHomeMetrics();
			});
		});

		// ===== EDIT BUTTON =====
		document.querySelectorAll(".edit-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const idx = btn.dataset.index;
				openEditModal(idx);
			});
		});

		// ===== CLICK ITEM NAME TO OPEN WIKI =====
		document.querySelectorAll(".item-name").forEach((el) => {
			el.addEventListener("click", () => {
				shell.openExternal(el.dataset.wiki);
			});
		});
	}

	// ===== VAULT SIDEBAR =====
	vaultBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			vaultBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			currentFilter = btn.dataset.filter;
			renderItems(currentFilter);
		});
	});

	// ===== HIDE OWNED CHECKBOX =====
	hideOwnedCheckbox.addEventListener("change", () => {
		renderItems(currentFilter);
	});

	// ===== HOME METRICS =====
	function updateHomeMetrics() {
		const totalUniques = allItems.length;
		const ownedUniques = allItems.filter((i) => i.owned).length;
		const obtainedDuringLeague = allItems.filter(
			(i) => i.obtainedDuringLeague
		).length;
		const remainingUniques = totalUniques - ownedUniques;

		document.getElementById("collectedCurrentLeague").textContent =
			obtainedDuringLeague;
		document.getElementById("ownedUniques").textContent = ownedUniques;
		document.getElementById("remainingUniques").textContent = remainingUniques;
		document.getElementById("totalUniques").textContent = totalUniques;

		const leagues = ["0.1", "0.2", "0.3"];
		leagues.forEach((league, idx) => {
			const leagueItems = allItems.filter(
				(i) => i.league === league && !i.bosses && !i.special
			);
			const total = leagueItems.filter((i) => i.league === league).length;
			const owned = leagueItems.filter(
				(i) => i.league === league && i.owned
			).length;
			const obtainedDuringLeague = leagueItems.filter(
				(i) => i.league === league && i.obtainedDuringLeague
			).length;
			const remaining = total - owned;

			document.getElementById(`total0${idx + 1}`).textContent = total;
			document.getElementById(`owned0${idx + 1}`).textContent = owned;
			document.getElementById(`league0${idx + 1}`).textContent =
				obtainedDuringLeague;
			document.getElementById(`remaining0${idx + 1}`).textContent = remaining;
		});

		const totalBosses = allItems.filter((i) => i.bosses).length;
		const ownedBosses = allItems.filter((i) => i.bosses && i.owned).length;
		const obtainedDuringLeagueBosses = allItems.filter(
			(i) => i.bosses && i.obtainedDuringLeague
		).length;
		document.getElementById("totalBosses").textContent = totalBosses;
		document.getElementById("ownedBosses").textContent = ownedBosses;
		document.getElementById("leagueBosses").textContent =
			obtainedDuringLeagueBosses;
		document.getElementById("remainingBosses").textContent =
			totalBosses - ownedBosses;

		const totalSpecial = allItems.filter((i) => i.special).length;
		const ownedSpecial = allItems.filter((i) => i.special && i.owned).length;
		const obtainedDuringLeagueSpecial = allItems.filter(
			(i) => i.special && i.obtainedDuringLeague
		).length;
		document.getElementById("totalSpecial").textContent = totalSpecial;
		document.getElementById("ownedSpecial").textContent = ownedSpecial;
		document.getElementById("leagueSpecial").textContent =
			obtainedDuringLeagueSpecial;
		document.getElementById("remainingSpecial").textContent =
			totalSpecial - ownedSpecial;
	}

	// ===== UTILS: ADD ITEM =====
	addItemForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(addItemForm);
		const newItem = {
			name: formData.get("name"),
			base: formData.get("base"),
			category: formData.get("category"),
			league: formData.get("league"),
			obtainMethod: formData.get("obtainMethod"),
			owned: formData.get("owned") === "true",
			obtainedDuringLeague: formData.get("obtainedDuringLeague") === "true",
			bosses: formData.get("bosses") === "true",
			special: formData.get("special") === "true",
			foil: formData.get("foil") === "true",
			imageLink: formData.get("imageLink"),
			wikiLink: formData.get("wikiLink"),
		};

		allItems.push(newItem);
		saveVaultData();
		addItemForm.reset();
		alert("Item added successfully!");
		renderItems(currentFilter);
		updateHomeMetrics();
	});

	// ===== UTILS: SEARCH =====
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.toLowerCase().trim();
		if (!query) {
			searchResults.innerHTML = "";
			return;
		}

		const results = allItems.filter(
			(item) =>
				item.name.toLowerCase().includes(query) ||
				item.league.toLowerCase().includes(query) ||
				item.base.toLowerCase().includes(query) ||
				item.category.toLowerCase().includes(query) ||
				item.obtainMethod.toLowerCase().includes(query)
		);

		searchResults.innerHTML = results
			.map(
				(item) => `
      <div class="item-card" style="background-color:${
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
        </div>
        <div class="item-image" style="flex-shrink:0; margin-left:1rem;">
          <img src="${item.imageLink}" alt="${
					item.name
				}" style="border-radius:6px;">
        </div>
      </div>`
			)
			.join("");

		searchResults.querySelectorAll(".item-name").forEach((el) => {
			el.addEventListener("click", () => {
				shell.openExternal(el.dataset.wiki);
			});
		});
	});

	// ===== EDIT MODAL FUNCTIONS =====
	function openEditModal(index) {
		const item = allItems[index];
		document.getElementById("editItemIndex").value = index;
		document.getElementById("editName").value = item.name;
		document.getElementById("editBase").value = item.base;
		document.getElementById("editCategory").value = item.category;
		document.getElementById("editLeague").value = item.league;
		document.getElementById("editObtainMethod").value = item.obtainMethod;
		document.getElementById("editOwned").value = item.owned.toString();
		document.getElementById("editObtainedDuringLeague").value =
			item.obtainedDuringLeague.toString();
		document.getElementById("editBosses").value = item.bosses.toString();
		document.getElementById("editSpecial").value = item.special.toString();
		document.getElementById("editFoil").value = (item.foil || false).toString();
		document.getElementById("editImageLink").value = item.imageLink;
		document.getElementById("editWikiLink").value = item.wikiLink;
		editModal.style.display = "block";
	}

	function closeEditModal() {
		editModal.style.display = "none";
	}

	// Close modal when clicking the X
	modalClose.addEventListener("click", closeEditModal);

	// Close modal when clicking outside
	window.addEventListener("click", (e) => {
		if (e.target === editModal) {
			closeEditModal();
		}
	});

	// Save edited item
	editItemForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const index = parseInt(document.getElementById("editItemIndex").value);
		allItems[index] = {
			name: document.getElementById("editName").value,
			base: document.getElementById("editBase").value,
			category: document.getElementById("editCategory").value,
			league: document.getElementById("editLeague").value,
			obtainMethod: document.getElementById("editObtainMethod").value,
			owned: document.getElementById("editOwned").value === "true",
			obtainedDuringLeague:
				document.getElementById("editObtainedDuringLeague").value === "true",
			bosses: document.getElementById("editBosses").value === "true",
			special: document.getElementById("editSpecial").value === "true",
			foil: document.getElementById("editFoil").value === "true",
			imageLink: document.getElementById("editImageLink").value,
			wikiLink: document.getElementById("editWikiLink").value,
		};
		saveVaultData();
		closeEditModal();
		renderItems(currentFilter);
		updateHomeMetrics();
	});

	// Delete item
	deleteItemBtn.addEventListener("click", () => {
		if (confirm("Are you sure you want to delete this item?")) {
			const index = parseInt(document.getElementById("editItemIndex").value);
			allItems.splice(index, 1);
			saveVaultData();
			closeEditModal();
			renderItems(currentFilter);
			updateHomeMetrics();
		}
	});

	// ===== INITIALIZE =====
	loadVaultData();
	renderItems("all");
	updateHomeMetrics();
});
