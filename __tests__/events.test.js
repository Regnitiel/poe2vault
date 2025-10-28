const { setupEventListeners } = require("../utils/events");

describe("events.js", () => {
	let mainButtons,
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
		itemList;
	beforeEach(() => {
		document.body.innerHTML = `
      <button class="tab-btn" data-tab="tab1"></button>
      <section id="tab1"></section>
      <button class="vault-btn" data-filter="all"></button>
      <input type="checkbox" id="hideOwnedCheckbox" />
      <form id="addItemForm"></form>
      <input id="searchInput" />
      <div id="searchResults"></div>
      <div id="editModal"></div>
      <form id="editItemForm"></form>
      <span class="modal-close"></span>
      <button id="deleteItemBtn"></button>
      <div id="itemList"></div>
    `;
		mainButtons = document.querySelectorAll(".tab-btn");
		sections = document.querySelectorAll("main > section");
		vaultBtns = document.querySelectorAll(".vault-btn");
		hideOwnedCheckbox = document.getElementById("hideOwnedCheckbox");
		addItemForm = document.getElementById("addItemForm");
		searchInput = document.getElementById("searchInput");
		searchResults = document.getElementById("searchResults");
		editModal = document.getElementById("editModal");
		editItemForm = document.getElementById("editItemForm");
		modalClose = document.querySelector(".modal-close");
		deleteItemBtn = document.getElementById("deleteItemBtn");
		allItems = [];
		itemList = document.getElementById("itemList");
	});

	it("should setup event listeners without error", () => {
		expect(() =>
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
				currentFilter: "all",
				itemList,
				renderItems: jest.fn(),
				openEditModal: jest.fn(),
				closeEditModal: jest.fn(),
				saveVaultData: jest.fn(),
				updateHomeMetrics: jest.fn(),
			})
		).not.toThrow();
	});
});
