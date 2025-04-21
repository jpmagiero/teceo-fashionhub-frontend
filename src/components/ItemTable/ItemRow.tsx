import { TableRow, TableCell } from "@mui/material";
import { Item } from "../../domain/item";

interface ItemRowProps {
  item: Item;
}

export function ItemRow({ item }: ItemRowProps) {
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.brand}</TableCell>
      <TableCell>{item.size}</TableCell>
      <TableCell>{item.color}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell>{item.price}</TableCell>
      <TableCell>{item.status}</TableCell>
    </TableRow>
  );
}
