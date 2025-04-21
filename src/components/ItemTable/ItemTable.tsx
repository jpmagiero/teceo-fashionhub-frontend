import { Paper, Typography, Divider, TableCell, TableRow } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Item } from "../../domain/item";
import { StatusCell } from "./StatusCell";
import { useMemo, useCallback } from "react";

interface ItemTableProps {
  items: Item[];
  loadMore: () => void;
  hasMore: boolean;
}

export function ItemTable({ items, loadMore, hasMore }: ItemTableProps) {
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
        <TableCell width={columnWidth}>{item.name}</TableCell>
        <TableCell width={columnWidth}>{item.brand}</TableCell>
        <TableCell width={columnWidth}>{item.size}</TableCell>
        <TableCell width={columnWidth}>{item.color}</TableCell>
        <TableCell width={columnWidth}>{item.category}</TableCell>
        <TableCell width={columnWidth}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(item.price)}
        </TableCell>
        <TableCell width={columnWidth}>
          <StatusCell status={item.status} />
        </TableCell>
      </>
    ),
    [columnWidth]
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
        color="primary"
        fontWeight={600}
        sx={{ mb: 1, letterSpacing: 1 }}
      >
        Lista de Itens
      </Typography>
      <Divider sx={{ width: "100%", maxWidth: 1100, mb: 2 }} />
      <Paper
        style={{
          height: 600,
          maxWidth: 1100,
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
