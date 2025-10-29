import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../src/components/Header/Header";

describe("Header Component", () => {
	test("renders all tabs", () => {
		const mockOnTabChange = jest.fn();
		render(<Header currentTab="home" onTabChange={mockOnTabChange} />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Vault")).toBeInTheDocument();
		expect(screen.getByText("Utils")).toBeInTheDocument();
	});

	test("calls onTabChange when tab is clicked", () => {
		const mockOnTabChange = jest.fn();
		render(<Header currentTab="home" onTabChange={mockOnTabChange} />);

		fireEvent.click(screen.getByText("Vault"));
		expect(mockOnTabChange).toHaveBeenCalledWith("vault");
	});

	test("applies active class to current tab", () => {
		const mockOnTabChange = jest.fn();
		render(<Header currentTab="vault" onTabChange={mockOnTabChange} />);

		const vaultButton = screen.getByText("Vault");
		expect(vaultButton).toHaveClass("active");
	});
});
