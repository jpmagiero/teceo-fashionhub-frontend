import { http } from "msw";
import { API_BASE_URL } from "../../utils/config";

export const handlers = [
  http.get(`${API_BASE_URL}/items`, () => {
    return new Response(
      JSON.stringify({
        items: [
          {
            id: 1,
            name: "Item 1",
            brand: "Brand 1",
            price: 100,
            status: "in_stock",
          },
          {
            id: 2,
            name: "Item 2",
            brand: "Brand 2",
            price: 200,
            status: "last_units",
          },
        ],
        nextCursor: null,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }),

  http.put(`${API_BASE_URL}/items/:id`, ({ params }) => {
    const { id } = params;
    return new Response(
      JSON.stringify({
        id: Number(id),
        price: 150,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }),
];
