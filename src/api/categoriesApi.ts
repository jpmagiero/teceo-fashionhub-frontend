import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export interface Category {
  id: number;
  name: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
}
