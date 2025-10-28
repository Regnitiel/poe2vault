// Handles opening and closing the edit modal
function openEditModal(index, allItems) {
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
	document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
	document.getElementById("editModal").style.display = "none";
}

module.exports = { openEditModal, closeEditModal };
