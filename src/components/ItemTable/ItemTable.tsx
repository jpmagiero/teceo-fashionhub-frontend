import { Paper, TableCell, Checkbox } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Item } from "../../domain/item";
import { StatusCell } from "./StatusCell";
import { useMemo, useCallback, useState } from "react";
import { TextEditableCell } from "./EditableFields/TextEditableCell";
import { NumberEditableCell } from "./EditableFields/NumberEditableCell";
import { SelectEditableCell } from "./EditableFields/SelectEditableCell";
import { bulkUpdateStatus } from "../../api/itemsApi";
import { TableToolbar } from "./components/TableToolbar";
import { BulkUpdateModal } from "./components/BulkUpdateModal";
import { ItemTableHeader } from "./components/ItemTableHeader";
import { useTableSelection } from "../../hooks/useTableSelection";
import { useCategoryOptions } from "../../hooks/useCategoryOptions";
import { STATUS_OPTIONS } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatters";

interface ItemTableProps {
  items: Item[];
  loadMore: () => void;
  hasMore: boolean;
  refreshItems: () => void;
  updateItemInState: (updatedItem: Item) => void;
}

export function ItemTable({
  items,
  loadMore,
  hasMore,
  refreshItems,
  updateItemInState,
}: ItemTableProps) {
  const { selectedItems, handleSelectItem, clearSelection } =
    useTableSelection();
  const { categoryOptions } = useCategoryOptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = useMemo(
    () => [
      { label: "Nome", dataKey: "name" },
      { label: "Marca", dataKey: "brand" },
      { label: "Tamanho", dataKey: "size" },
      { label: "Cor", dataKey: "color" },
      { label: "Categoria", dataKey: "category" },
      { label: "Preço", dataKey: "price" },
      { label: "Status", dataKey: "status" },
    ],
    []
  );

  const columnWidth = useMemo(() => `${100 / columns.length}%`, [columns]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleBulkUpdate = useCallback(
    async (status: string) => {
      if (selectedItems.length === 0) return;

      setIsSubmitting(true);
      try {
        await bulkUpdateStatus({
          ids: selectedItems,
          status,
        });

        setIsModalOpen(false);
        clearSelection();
        refreshItems();
      } catch (error) {
        console.error("Erro ao atualizar itens:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedItems, clearSelection, refreshItems]
  );

  const handleUpdateSuccess = useCallback(
    (updatedItem: Item) => {
      updateItemInState(updatedItem);
    },
    [updateItemInState]
  );

  const renderRow = useCallback(
    (_index: number, item: Item) => (
      <>
        <TableCell padding="checkbox" width="48px">
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            color="primary"
          />
        </TableCell>
        <TextEditableCell
          value={item.name}
          itemId={item.id}
          fieldName="name"
          width={columnWidth}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <TextEditableCell
          value={item.brand}
          itemId={item.id}
          fieldName="brand"
          width={columnWidth}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <TextEditableCell
          value={item.size}
          itemId={item.id}
          fieldName="size"
          width={columnWidth}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <TextEditableCell
          value={item.color}
          itemId={item.id}
          fieldName="color"
          width={columnWidth}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <SelectEditableCell
          value={item.categoryId}
          itemId={item.id}
          fieldName="categoryId"
          width={columnWidth}
          options={categoryOptions}
          renderDisplay={() => item.category}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <NumberEditableCell
          value={item.price}
          itemId={item.id}
          fieldName="price"
          width={columnWidth}
          formatter={formatCurrency}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <SelectEditableCell
          value={item.status}
          itemId={item.id}
          fieldName="status"
          width={columnWidth}
          options={STATUS_OPTIONS}
          renderDisplay={(value) => <StatusCell status={value as string} />}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </>
    ),
    [
      columnWidth,
      categoryOptions,
      selectedItems,
      handleSelectItem,
      handleUpdateSuccess,
    ]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 32,
      }}
    >
      <TableToolbar
        title="Lista de Produtos"
        selectedCount={selectedItems.length}
        onBulkAction={openModal}
      />

      <Paper
        style={{
          height: "calc(90vh - 70px)",
          maxWidth: "95%",
          width: "100%",
          minWidth: 320,
          margin: "0 8px",
          overflow: "hidden",
        }}
      >
        <TableVirtuoso
          data={items}
          endReached={hasMore ? loadMore : undefined}
          style={{ height: "100%", width: "100%" }}
          overscan={{ main: 50, reverse: 50 }}
          components={{
            Table: (props) => (
              <table
                {...props}
                style={{
                  ...props.style,
                  tableLayout: "fixed",
                  width: "100%",
                }}
              />
            ),
            EmptyPlaceholder: () => (
              <div style={{ padding: 16 }}>Nenhum item encontrado.</div>
            ),
          }}
          fixedHeaderContent={() => <ItemTableHeader columns={columns} />}
          itemContent={renderRow}
        />
      </Paper>

      <BulkUpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedItems={selectedItems}
        items={items}
        onUpdateStatus={handleBulkUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
