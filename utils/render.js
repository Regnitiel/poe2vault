const { shell } = require("electron");

function renderItems(
	allItems,
	currentFilter,
	hideOwnedCheckbox,
	itemList,
	vaultBtns,
	renderItemsCallback,
	openEditModal,
	saveVaultData,
	updateHomeMetrics
) {
	let filtered = allItems;
	if (currentFilter !== "all") {
		if (currentFilter === "Bosses") filtered = filtered.filter((i) => i.bosses);
		else if (currentFilter === "Special")
			filtered = filtered.filter((i) => i.special);
		else filtered = filtered.filter((i) => i.league === currentFilter);
	}
	const groupedItems = {};
	let displayFiltered = [...filtered];
	if (hideOwnedCheckbox.checked) {
		displayFiltered = displayFiltered.filter((i) => !i.owned);
	}
	filtered.forEach((item) => {
		let groupKey;
		if (currentFilter === "Bosses") {
			groupKey = item.obtainMethod.split(" drops")[0];
		} else {
			groupKey = item.category;
		}
		if (!groupedItems[groupKey]) {
			groupedItems[groupKey] = { all: [], display: [] };
		}
		groupedItems[groupKey].all.push(item);
		if (!hideOwnedCheckbox.checked || !item.owned) {
			groupedItems[groupKey].display.push(item);
		}
	});
	const sortedGroups = Object.keys(groupedItems).sort();
	let html = "";
	sortedGroups.forEach((group) => {
		const totalInGroup = groupedItems[group].all.length;
		const ownedInGroup = groupedItems[group].all.filter(
			(item) => item.owned
		).length;
		const completionPercentage = Math.round(
			(ownedInGroup / totalInGroup) * 100
		);
		html += `<div class="category-section">
        <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px;">
          <h3 class="category-title">${group} ${ownedInGroup}/${totalInGroup} - ${completionPercentage}%</h3>
        </div>
        <div class="category-items">`;
		groupedItems[group].display.forEach((item) => {
			const idx = allItems.indexOf(item);
			let bgColor;
			if (item.foil) {
				bgColor = "rgba(251,191,36,0.3)";
			} else if (item.obtainedDuringLeague) {
				bgColor = "rgba(59,130,246,0.4)";
			} else if (item.owned) {
				bgColor = "rgba(21,128,61,0.4)";
			} else {
				bgColor = "rgba(153,27,27,0.4)";
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
              <img src="${
								item.imageLink.startsWith("http")
									? item.imageLink
									: `./Images/${item.imageLink}`
							}" 
                   alt="${item.name}" 
                   style="border-radius:6px;">
            </div>
          </div>`;
		});
		html += `</div></div>`;
	});
	itemList.innerHTML = html;
	document.querySelectorAll(".owned-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = btn.dataset.index;
			allItems[idx].owned = allItems[idx].owned ? false : true;
			allItems[idx].obtainedDuringLeague = false;
			saveVaultData(allItems);
			renderItemsCallback(
				allItems,
				currentFilter,
				hideOwnedCheckbox,
				itemList,
				vaultBtns,
				renderItemsCallback,
				openEditModal,
				saveVaultData,
				updateHomeMetrics
			);
			updateHomeMetrics(allItems);
		});
	});
	document.querySelectorAll(".obtained-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = btn.dataset.index;
			allItems[idx].owned = true;
			allItems[idx].obtainedDuringLeague = true;
			saveVaultData(allItems);
			renderItemsCallback(
				allItems,
				currentFilter,
				hideOwnedCheckbox,
				itemList,
				vaultBtns,
				renderItemsCallback,
				openEditModal,
				saveVaultData,
				updateHomeMetrics
			);
			updateHomeMetrics(allItems);
		});
	});
	document.querySelectorAll(".foil-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = btn.dataset.index;
			allItems[idx].foil = allItems[idx].foil ? false : true;
			saveVaultData(allItems);
			renderItemsCallback(
				allItems,
				currentFilter,
				hideOwnedCheckbox,
				itemList,
				vaultBtns,
				renderItemsCallback,
				openEditModal,
				saveVaultData,
				updateHomeMetrics
			);
			updateHomeMetrics(allItems);
		});
	});
	document.querySelectorAll(".edit-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = btn.dataset.index;
			openEditModal(idx, allItems);
		});
	});
	document.querySelectorAll(".item-name").forEach((el) => {
		el.addEventListener("click", () => {
			shell.openExternal(el.dataset.wiki);
		});
	});
}

function updateHomeMetrics(allItems) {
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

module.exports = { renderItems, updateHomeMetrics };
