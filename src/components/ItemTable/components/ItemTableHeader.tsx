import { TableRow, TableCell } from "@mui/material";
import { useMemo } from "react";

interface Column {
  label: string;
  dataKey: string;
}

interface ItemTableHeaderProps {
  columns: Column[];
}

export function ItemTableHeader({ columns }: ItemTableHeaderProps) {
  const columnWidth = useMemo(() => `${100 / columns.length}%`, [columns]);

  return (
    <TableRow>
      <TableCell
        padding="checkbox"
        sx={{
          fontWeight: "bold",
          background: "#f5f5f5",
          width: "48px",
        }}
      />
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
  );
}
