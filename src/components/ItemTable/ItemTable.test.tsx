import { render, screen } from "@testing-library/react";
import { ItemTable } from "./ItemTable";
import { describe, test, expect, vi } from "vitest";
import { Item } from "../../domain/item";

vi.mock("react-virtuoso", () => ({
  TableVirtuoso: ({
    data,
    itemContent,
  }: {
    data: Item[];
    itemContent: (index: number, item: Item) => React.ReactNode;
  }) => {
    return (
      <table>
        <tbody>
          {data.map((item: Item, index: number) => (
            <tr key={item.id}>{itemContent(index, item)}</tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

const mockProps = {
  items: [
    {
      id: 1,
      name: "Item 1",
      brand: "Brand 1",
      price: 100,
      status: "in_stock",
      size: "M",
      color: "Blue",
      category: "Shirts",
      categoryId: 1,
    },
  ],
  loadMore: vi.fn(),
  hasMore: false,
  refreshItems: vi.fn(),
  updateItemInState: vi.fn(),
};

vi.mock("../../hooks/useTableSelection", () => ({
  useTableSelection: () => ({
    selectedItems: [],
    handleSelectItem: vi.fn(),
    clearSelection: vi.fn(),
  }),
}));

vi.mock("../../hooks/useCategoryOptions", () => ({
  useCategoryOptions: () => ({
    categoryOptions: [{ value: 1, label: "Shirts" }],
    categories: [{ id: 1, name: "Shirts" }],
  }),
}));

describe("ItemTable", () => {
  test("should render table with items", () => {
    render(<ItemTable {...mockProps} />);

    expect(screen.getByText("Lista de Produtos")).toBeInTheDocument();

    const nameElements = screen.getAllByText(/Item 1/i);
    expect(nameElements.length).toBeGreaterThan(0);

    const brandElements = screen.getAllByText(/Brand 1/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });
});
