import { useState, useCallback } from "react";

export function useTableSelection() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelectItem = useCallback(
    (itemId: number, isSelected: boolean) => {
      setSelectedItems((prev) => {
        if (isSelected) {
          if (prev.includes(itemId)) return prev;
          return [...prev, itemId];
        } else {
          return prev.filter((id) => id !== itemId);
        }
      });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    selectedItems,
    handleSelectItem,
    clearSelection,
    hasSelection: selectedItems.length > 0,
  };
}
