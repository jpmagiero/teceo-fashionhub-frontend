import { useState, useEffect, useMemo } from "react";
import { fetchCategories, Category } from "../../../api/categoriesApi";

export function useCategoryOptions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err : new Error("Erro ao carregar categorias")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  return {
    categoryOptions,
    categories,
    isLoading,
    error,
  };
}
