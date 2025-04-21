import axios from "axios";
import { Item } from "../domain/item";

export interface FetchItemsParams {
  take: number;
  cursor: number;
}

export interface FetchItemsResponse {
  items: Item[];
  nextCursor: number | null;
}

export async function fetchItems({
  take,
  cursor,
}: FetchItemsParams): Promise<FetchItemsResponse> {
  const response = await axios.get("http://localhost:3000/items", {
    params: { take, cursor },
  });
  return response.data;
}
