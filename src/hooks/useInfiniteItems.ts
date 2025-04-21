import { useEffect, useState, useCallback, useRef } from "react";
import { fetchItems, FetchItemsResponse } from "../api/itemsApi";
import { Item } from "../domain/item";

const MAX_ITEMS_IN_MEMORY = 500;

export function useInfiniteItems() {
  const [items, setItems] = useState<Item[]>([]);
  const firstLoadedItemsRef = useRef<Item[]>([]);
  const [cursor, setCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const totalItemsRef = useRef(0);
  const seenItemIds = useRef<Set<number>>(new Set());

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: FetchItemsResponse = await fetchItems({ take: 20, cursor: 0 });

      seenItemIds.current = new Set(res.items.map((item) => item.id));

      firstLoadedItemsRef.current = [...res.items];

      setItems(res.items);
      setCursor(res.nextCursor ?? 0);
      setHasMore(res.nextCursor !== null);
      totalItemsRef.current = res.items.length;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    try {
      const res: FetchItemsResponse = await fetchItems({ take: 20, cursor });

      if (res.items.length === 0) {
        setHasMore(false);
        return;
      }

      const newItems = res.items.filter(
        (item) => !seenItemIds.current.has(item.id)
      );

      newItems.forEach((item) => seenItemIds.current.add(item.id));

      setItems((prevItems) => {
        totalItemsRef.current += newItems.length;

        const firstItems = firstLoadedItemsRef.current;

        const middleItems = prevItems.filter(
          (item) => !firstItems.some((firstItem) => firstItem.id === item.id)
        );

        const allItems = [...firstItems, ...middleItems, ...newItems];
        allItems.sort((a, b) => a.id - b.id);

        if (allItems.length > MAX_ITEMS_IN_MEMORY) {
          const preservedFirstItems = allItems.slice(0, firstItems.length);

          const itemsToKeepAtEnd = Math.min(100, newItems.length);
          const preservedLatestItems = allItems.slice(-itemsToKeepAtEnd);

          const middleItemsLimit =
            MAX_ITEMS_IN_MEMORY -
            preservedFirstItems.length -
            preservedLatestItems.length;
          const middleItemsToKeep = allItems
            .slice(firstItems.length, allItems.length - itemsToKeepAtEnd)
            .slice(-middleItemsLimit);

          return [
            ...preservedFirstItems,
            ...middleItemsToKeep,
            ...preservedLatestItems,
          ];
        }

        return allItems;
      });

      if (res.nextCursor !== null) {
        setCursor(res.nextCursor);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading]);

  useEffect(() => {
    if (items.length === 0) {
      loadItems();
    }
  }, [items.length, loadItems]);

  return {
    items,
    loadMore,
    hasMore,
    isLoading,
    refreshItems: loadItems,
    totalItemsCount: totalItemsRef.current,
  };
}
