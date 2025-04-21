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

export interface UpdateItemParams {
  id: number;
  data: Partial<Omit<Item, "id">>;
}

export async function updateItem({
  id,
  data,
}: UpdateItemParams): Promise<Item> {
  const response = await axios.put(`http://localhost:3000/items/${id}`, data);
  return response.data;
}

export interface BulkUpdateStatusParams {
  ids: number[];
  status: string;
}

export async function bulkUpdateStatus({
  ids,
  status,
}: BulkUpdateStatusParams): Promise<void> {
  await axios.patch("http://localhost:3000/items/bulk/status", { ids, status });
}
