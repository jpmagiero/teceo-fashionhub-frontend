import { Paper, Typography, Divider, TableCell, TableRow } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Item } from "../../domain/item";
import { StatusCell } from "./StatusCell";
import { useMemo, useCallback, useEffect, useState } from "react";
import { TextEditableCell } from "./EditableFields/TextEditableCell";
import { NumberEditableCell } from "./EditableFields/NumberEditableCell";
import { SelectEditableCell } from "./EditableFields/SelectEditableCell";
import { fetchCategories, Category } from "../../api/categoriesApi";

interface ItemTableProps {
  items: Item[];
  loadMore: () => void;
  hasMore: boolean;
}

const STATUS_OPTIONS = [
  { value: "in_stock", label: "Em estoque" },
  { value: "last_units", label: "Últimas unidades" },
  { value: "out_of_stock", label: "Fora de estoque" },
];

export function ItemTable({ items, loadMore, hasMore }: ItemTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

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

  const renderHeader = useCallback(
    () => (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            sx={{
              fontWeight: "bold",
              background: "#f5f5f5",
              textAlign: "left",
            }}
            width={columnWidth}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    ),
    [columns, columnWidth]
  );

  const renderRow = useCallback(
    (_index: number, item: Item) => (
      <>
        <TextEditableCell
          value={item.name}
          itemId={item.id}
          fieldName="name"
          width={columnWidth}
        />
        <TextEditableCell
          value={item.brand}
          itemId={item.id}
          fieldName="brand"
          width={columnWidth}
        />
        <TextEditableCell
          value={item.size}
          itemId={item.id}
          fieldName="size"
          width={columnWidth}
        />
        <TextEditableCell
          value={item.color}
          itemId={item.id}
          fieldName="color"
          width={columnWidth}
        />
        <SelectEditableCell
          value={item.categoryId}
          itemId={item.id}
          fieldName="categoryId"
          width={columnWidth}
          options={categoryOptions}
          renderDisplay={() => item.category}
        />
        <NumberEditableCell
          value={item.price}
          itemId={item.id}
          fieldName="price"
          width={columnWidth}
          formatter={(value) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
        />
        <SelectEditableCell
          value={item.status}
          itemId={item.id}
          fieldName="status"
          width={columnWidth}
          options={STATUS_OPTIONS}
          renderDisplay={(value) => <StatusCell status={value as string} />}
        />
      </>
    ),
    [columnWidth, categoryOptions]
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
      <Typography
        variant="h5"
        color="#fc6b4b"
        fontWeight={600}
        sx={{ mb: 1, letterSpacing: 1 }}
      >
        Lista de Produtos
      </Typography>
      <Divider sx={{ width: "100%", maxWidth: 1100, mb: 2 }} />
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
          fixedHeaderContent={renderHeader}
          itemContent={renderRow}
        />
      </Paper>
    </div>
  );
}
