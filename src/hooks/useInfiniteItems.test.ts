import { renderHook, act, waitFor } from "@testing-library/react";
import { useInfiniteItems } from "./useInfiniteItems";
import { server } from "../test/mocks/server";
import { http } from "msw";
import { API_BASE_URL } from "../utils/config";
import { describe, test, expect, beforeEach } from "vitest";

const mockItems = [
  { id: 1, name: "Item 1", brand: "Brand 1", price: 100, status: "in_stock" },
  { id: 2, name: "Item 2", brand: "Brand 2", price: 200, status: "last_units" },
];

describe("useInfiniteItems", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE_URL}/items`, () => {
        return new Response(
          JSON.stringify({
            items: mockItems,
            nextCursor: null,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
  });

  test("should load items on initial render", async () => {
    const { result } = renderHook(() => useInfiniteItems());

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.items).toHaveLength(2);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test("should update item in state correctly", async () => {
    const { result } = renderHook(() => useInfiniteItems());

    await waitFor(() => expect(result.current.items).toHaveLength(2));

    const updatedItem = {
      id: 1,
      name: "Updated Item",
      brand: "Brand 1",
      price: 100,
      status: "in_stock",
      size: "M",
      color: "Blue",
      category: "Shirts",
      categoryId: 1,
    };

    act(() => {
      result.current.updateItemInState(updatedItem);
    });

    expect(result.current.items[0].name).toBe("Updated Item");
  });
});
