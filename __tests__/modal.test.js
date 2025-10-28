const { openEditModal, closeEditModal } = require("../utils/modal");

describe("modal.js", () => {
	beforeEach(() => {
		document.body.innerHTML = `
      <input id="editItemIndex" />
      <input id="editName" />
      <input id="editBase" />
      <input id="editCategory" />
      <input id="editLeague" />
      <input id="editObtainMethod" />
      <input id="editOwned" />
      <input id="editObtainedDuringLeague" />
      <input id="editBosses" />
      <input id="editSpecial" />
      <input id="editFoil" />
      <input id="editImageLink" />
      <input id="editWikiLink" />
      <div id="editModal" style="display:none"></div>
    `;
	});

	it("should open and fill modal fields", () => {
		const items = [
			{
				name: "Test",
				base: "Base",
				category: "Cat",
				league: "0.1",
				obtainMethod: "Drop",
				owned: true,
				obtainedDuringLeague: false,
				bosses: false,
				special: false,
				foil: true,
				imageLink: "img.png",
				wikiLink: "wiki",
			},
		];
		openEditModal(0, items);
		expect(document.getElementById("editName").value).toBe("Test");
		expect(document.getElementById("editModal").style.display).toBe("block");
	});

	it("should close modal", () => {
		document.getElementById("editModal").style.display = "block";
		closeEditModal();
		expect(document.getElementById("editModal").style.display).toBe("none");
	});
});
