import { useState } from "react";
import { TextField, Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { EditableCell } from "./EditableCell";
import { Item } from "../../../domain/item";

interface NumberEditableCellProps {
  value: number;
  itemId: number;
  fieldName: Extract<keyof Item, "price" | "categoryId">;
  width: string;
  onUpdateSuccess?: (updatedItem: Item) => void;
  formatter?: (value: number) => string;
}

export function NumberEditableCell({
  value,
  itemId,
  fieldName,
  width,
  formatter,
  onUpdateSuccess,
}: NumberEditableCellProps) {
  return (
    <EditableCell<number>
      initialValue={value}
      itemId={itemId}
      fieldName={fieldName}
      width={width}
      onUpdateSuccess={onUpdateSuccess}
      render={(currentValue, isEditing, onSubmit, onCancel) => {
        return isEditing ? (
          <NumberEditor
            value={currentValue}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : (
          <span>
            {formatter ? formatter(currentValue) : currentValue.toString()}
          </span>
        );
      }}
    />
  );
}

interface NumberEditorProps {
  value: number;
  onSubmit: (value: number) => void;
  onCancel: () => void;
}

function NumberEditor({ value, onSubmit, onCancel }: NumberEditorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onSubmit(numValue);
    } else {
      onCancel();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={(e) => e.stopPropagation()}
    >
      <TextField
        variant="standard"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="number"
        autoFocus
        fullWidth
        size="small"
      />
      <IconButton size="small" onClick={handleSubmit}>
        <CheckIcon fontSize="small" color="success" />
      </IconButton>
      <IconButton size="small" onClick={onCancel}>
        <CloseIcon fontSize="small" color="error" />
      </IconButton>
    </Box>
  );
}
