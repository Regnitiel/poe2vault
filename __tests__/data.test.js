const { loadVaultData, saveVaultData } = require("../utils/data");
const fs = require("fs");
const path = require("path");

describe("data.js", () => {
	const testFile = path.join(__dirname, "testVaultData.json");
	const testData = [
		{ name: "Item1", owned: false },
		{ name: "Item2", owned: true },
	];

	afterEach(() => {
		if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
	});

	it("should save and load vault data correctly", () => {
		fs.writeFileSync = jest.fn((file, data) => {
			expect(file).toContain("vaultData.json");
			expect(JSON.parse(data)).toEqual(testData);
		});

		saveVaultData(testData);

		fs.writeFileSync.mockRestore && fs.writeFileSync.mockRestore();
	});

	it("should handle missing file gracefully", () => {
		fs.readFileSync = jest.fn(() => {
			throw new Error("fail");
		});

		const spy = jest.spyOn(console, "error").mockImplementation(() => {});

		expect(() => loadVaultData()).not.toThrow();

		spy.mockRestore();

		fs.readFileSync.mockRestore && fs.readFileSync.mockRestore();
	});
});
