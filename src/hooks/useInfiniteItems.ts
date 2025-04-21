import { useEffect, useState, useCallback } from "react";
import { fetchItems, FetchItemsResponse } from "../api/itemsApi";
import { Item } from "../domain/item";

export function useInfiniteItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res: FetchItemsResponse = await fetchItems({ take: 20, cursor });
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor ?? 0);
      setHasMore(res.nextCursor !== null);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    if (items.length === 0) {
      loadMore();
    }
    // eslint-disable-next-line
  }, []);

  return { items, loadMore, hasMore, loading };
}
