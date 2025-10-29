import {
	filterItems,
	groupItemsByCategory,
	calculateHomeMetrics,
	calculateCategoryMetrics,
	searchItems,
} from "../src/utils/helpers";
import { VaultItem } from "../src/types";

const mockItems: VaultItem[] = [
	{
		name: "Test Item 1",
		base: "Test Base",
		category: "Weapons",
		league: "0.1",
		obtainMethod: "Drop",
		owned: true,
		obtainedDuringLeague: true,
		bosses: false,
		special: false,
		foil: false,
		disabled: false,
		imageLink: "test.jpg",
		wikiLink: "https://example.com",
	},
	{
		name: "Boss Item",
		base: "Boss Base",
		category: "Armor",
		league: "0.2",
		obtainMethod: "Boss drops",
		owned: false,
		obtainedDuringLeague: false,
		bosses: true,
		special: false,
		foil: false,
		disabled: false,
		imageLink: "boss.jpg",
		wikiLink: "https://example.com",
	},
];

describe("Helper Functions", () => {
	describe("filterItems", () => {
		test('should return all items when filter is "all"', () => {
			const result = filterItems(mockItems, "all");
			expect(result).toEqual(mockItems);
		});

		test("should filter by bosses", () => {
			const result = filterItems(mockItems, "Bosses");
			expect(result).toHaveLength(1);
			expect(result[0].bosses).toBe(true);
		});

		test("should filter by league", () => {
			const result = filterItems(mockItems, "0.1");
			expect(result).toHaveLength(1);
			expect(result[0].league).toBe("0.1");
		});
	});

	describe("calculateHomeMetrics", () => {
		test("should calculate correct metrics", () => {
			const result = calculateHomeMetrics(mockItems);
			expect(result.totalUniques).toBe(2);
			expect(result.ownedUniques).toBe(1);
			expect(result.collectedCurrentLeague).toBe(1);
			expect(result.remainingUniques).toBe(1);
		});
	});

	describe("searchItems", () => {
		test("should search by name", () => {
			const result = searchItems(mockItems, "Test Item");
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe("Test Item 1");
		});

		test("should return empty array for empty query", () => {
			const result = searchItems(mockItems, "");
			expect(result).toHaveLength(0);
		});
	});
});
