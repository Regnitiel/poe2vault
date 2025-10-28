const { loadVaultData, saveVaultData } = require("./utils/data.js");
const { renderItems, updateHomeMetrics } = require("./utils/render.js");
const { openEditModal, closeEditModal } = require("./utils/modal.js");
const { setupEventListeners } = require("./utils/events.js");

let allItems = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
	// Query DOM elements
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

	allItems = loadVaultData();

	setupEventListeners({
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
		currentFilter,
		itemList,
		renderItems,
		openEditModal,
		closeEditModal,
		saveVaultData,
		updateHomeMetrics,
	});

	renderItems(
		allItems,
		"all",
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
