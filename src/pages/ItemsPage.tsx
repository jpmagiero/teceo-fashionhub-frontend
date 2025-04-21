import { useInfiniteItems } from "../hooks/useInfiniteItems";
import { ItemTable } from "../components/ItemTable/ItemTable";

export default function ItemsPage() {
  const { items, loadMore, hasMore } = useInfiniteItems();

  return (
    <div>
      <ItemTable items={items} loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}
