import { useState } from "react";
import { TextField, Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { EditableCell } from "./EditableCell";
import { Item } from "../../../domain/item";

interface TextEditableCellProps {
  value: string;
  itemId: number;
  fieldName: Extract<
    keyof Item,
    "name" | "brand" | "size" | "color" | "status"
  >;
  width: string;
  onUpdateSuccess?: (updatedItem: Item) => void;
}

export function TextEditableCell({
  value,
  itemId,
  fieldName,
  width,
  onUpdateSuccess,
}: TextEditableCellProps) {
  return (
    <EditableCell<string>
      initialValue={value}
      itemId={itemId}
      fieldName={fieldName}
      width={width}
      onUpdateSuccess={onUpdateSuccess}
      render={(currentValue, isEditing, onSubmit, onCancel) => {
        return isEditing ? (
          <TextEditor
            value={currentValue}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : (
          <span>{currentValue}</span>
        );
      }}
    />
  );
}

interface TextEditorProps {
  value: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

function TextEditor({ value, onSubmit, onCancel }: TextEditorProps) {
  const [inputValue, setInputValue] = useState(value);

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
        autoFocus
        fullWidth
        size="small"
      />
      <IconButton size="small" onClick={() => onSubmit(inputValue)}>
        <CheckIcon fontSize="small" color="success" />
      </IconButton>
      <IconButton size="small" onClick={onCancel}>
        <CloseIcon fontSize="small" color="error" />
      </IconButton>
    </Box>
  );
}
