import { useState } from "react";
import { Select, MenuItem, Box, IconButton, FormControl } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { EditableCell } from "./EditableCell";
import { Item } from "../../../domain/item";

export interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface SelectEditableCellProps<T extends string | number> {
  value: T;
  itemId: number;
  fieldName: Extract<keyof Item, "status" | "categoryId">;
  width: string;
  options: Option<T>[];
  onUpdateSuccess?: (updatedItem: Item) => void;
  renderDisplay?: (value: T, options: Option<T>[]) => React.ReactNode;
}

export function SelectEditableCell<T extends string | number>({
  value,
  itemId,
  fieldName,
  width,
  options,
  onUpdateSuccess,
  renderDisplay,
}: SelectEditableCellProps<T>) {
  return (
    <EditableCell<T>
      initialValue={value}
      itemId={itemId}
      fieldName={fieldName}
      width={width}
      onUpdateSuccess={onUpdateSuccess}
      render={(currentValue, isEditing, onSubmit, onCancel) => {
        return isEditing ? (
          <SelectEditor<T>
            value={currentValue}
            options={options}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : renderDisplay ? (
          renderDisplay(currentValue, options)
        ) : (
          options.find((opt) => opt.value === currentValue)?.label ||
          String(currentValue)
        );
      }}
    />
  );
}

interface SelectEditorProps<T extends string | number> {
  value: T;
  options: Option<T>[];
  onSubmit: (value: T) => void;
  onCancel: () => void;
}

function SelectEditor<T extends string | number>({
  value,
  options,
  onSubmit,
  onCancel,
}: SelectEditorProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(value);

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={(e) => e.stopPropagation()}
    >
      <FormControl variant="standard" fullWidth size="small">
        <Select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value as T)}
          autoFocus
        >
          {options.map((option) => (
            <MenuItem key={String(option.value)} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton size="small" onClick={() => onSubmit(selectedValue)}>
        <CheckIcon fontSize="small" color="success" />
      </IconButton>
      <IconButton size="small" onClick={onCancel}>
        <CloseIcon fontSize="small" color="error" />
      </IconButton>
    </Box>
  );
}
