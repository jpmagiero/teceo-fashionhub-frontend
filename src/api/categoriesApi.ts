import axios from "axios";

export interface Category {
  id: number;
  name: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get("http://localhost:3000/categories");
  return response.data;
}
