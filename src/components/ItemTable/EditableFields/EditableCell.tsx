import { useState } from "react";
import { TableCell, Box, CircularProgress } from "@mui/material";
import { updateItem } from "../../../api/itemsApi";
import { Item } from "../../../domain/item";

type ValueType = string | number;

interface EditableCellProps<T extends ValueType> {
  initialValue: T;
  itemId: number;
  fieldName: keyof Omit<Item, "id" | "category">;
  width: string;
  render: (
    value: T,
    isEditing: boolean,
    onSubmit: (value: T) => void,
    onCancel: () => void
  ) => React.ReactNode;
  onUpdateSuccess?: (updatedItem: Item) => void;
}

export function EditableCell<T extends ValueType>({
  initialValue,
  itemId,
  fieldName,
  width,
  render,
  onUpdateSuccess,
}: EditableCellProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  const handleSubmit = async (newValue: T) => {
    if (newValue === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = { [fieldName]: newValue } as Partial<Omit<Item, "id">>;
      const updatedItem = await updateItem({ id: itemId, data });
      setValue(newValue);
      setIsEditing(false);
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedItem);
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <TableCell
      width={width}
      onClick={() => !isEditing && !isLoading && setIsEditing(true)}
      sx={{ cursor: isLoading ? "wait" : isEditing ? "auto" : "pointer" }}
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      ) : (
        render(value, isEditing, handleSubmit, handleCancel)
      )}
    </TableCell>
  );
}
