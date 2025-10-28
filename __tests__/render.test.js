const { renderItems, updateHomeMetrics } = require("../utils/render");

describe("render.js", () => {
	let itemList, hideOwnedCheckbox, vaultBtns;
	beforeEach(() => {
		itemList = { innerHTML: "" };
		hideOwnedCheckbox = { checked: false };
		vaultBtns = [];
		document.body.innerHTML = `
      <div id="collectedCurrentLeague"></div>
      <div id="ownedUniques"></div>
      <div id="remainingUniques"></div>
      <div id="totalUniques"></div>
      <div id="total01"></div>
      <div id="owned01"></div>
      <div id="league01"></div>
      <div id="remaining01"></div>
      <div id="total02"></div>
      <div id="owned02"></div>
      <div id="league02"></div>
      <div id="remaining02"></div>
      <div id="total03"></div>
      <div id="owned03"></div>
      <div id="league03"></div>
      <div id="remaining03"></div>
      <div id="totalBosses"></div>
      <div id="ownedBosses"></div>
      <div id="leagueBosses"></div>
      <div id="remainingBosses"></div>
      <div id="totalSpecial"></div>
      <div id="ownedSpecial"></div>
      <div id="leagueSpecial"></div>
      <div id="remainingSpecial"></div>
    `;
	});

	it("should render items and update metrics", () => {
		const items = [
			{
				name: "A",
				category: "Cat1",
				league: "0.1",
				owned: true,
				bosses: false,
				special: false,
				obtainMethod: "",
				foil: false,
				obtainedDuringLeague: false,
				imageLink: "",
				wikiLink: "",
			},
			{
				name: "B",
				category: "Cat1",
				league: "0.1",
				owned: false,
				bosses: false,
				special: false,
				obtainMethod: "",
				foil: false,
				obtainedDuringLeague: false,
				imageLink: "",
				wikiLink: "",
			},
			{
				name: "C",
				category: "Cat2",
				league: "0.2",
				owned: false,
				bosses: false,
				special: false,
				obtainMethod: "",
				foil: false,
				obtainedDuringLeague: false,
				imageLink: "",
				wikiLink: "",
			},
		];
		renderItems(
			items,
			"all",
			hideOwnedCheckbox,
			itemList,
			vaultBtns,
			jest.fn(),
			jest.fn(),
			jest.fn(),
			jest.fn()
		);
		expect(itemList.innerHTML).toContain("Cat1");
		expect(itemList.innerHTML).toContain("Cat2");
		updateHomeMetrics(items);
		expect(document.getElementById("ownedUniques").textContent).toBe("1");
		expect(document.getElementById("totalUniques").textContent).toBe("3");
	});
});
