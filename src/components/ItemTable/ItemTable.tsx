import {
  Paper,
  Typography,
  Divider,
  TableCell,
  TableRow,
  Checkbox,
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Item } from "../../domain/item";
import { StatusCell } from "./StatusCell";
import { useMemo, useCallback, useEffect, useState } from "react";
import { TextEditableCell } from "./EditableFields/TextEditableCell";
import { NumberEditableCell } from "./EditableFields/NumberEditableCell";
import { SelectEditableCell } from "./EditableFields/SelectEditableCell";
import { fetchCategories, Category } from "../../api/categoriesApi";
import { bulkUpdateStatus } from "../../api/itemsApi";

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>("in_stock");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectItem = useCallback(
    (itemId: number, isSelected: boolean) => {
      setSelectedItems((prev) => {
        if (isSelected) {
          if (prev.includes(itemId)) {
            return prev;
          }
          return [...prev, itemId];
        } else {
          return prev.filter((id) => id !== itemId);
        }
      });
    },
    []
  );

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    setBulkStatus(event.target.value);
  }, []);

  const handleBulkUpdate = useCallback(async () => {
    if (selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await bulkUpdateStatus({
        ids: selectedItems,
        status: bulkStatus,
      });

      setIsModalOpen(false);
      setSelectedItems([]);
    } catch (error) {
      console.error("Erro ao atualizar itens:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedItems, bulkStatus]);

  const renderHeader = useCallback(
    () => (
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
    ),
    [columns, columnWidth]
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
    [columnWidth, categoryOptions, selectedItems, handleSelectItem]
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
      <Box
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h5"
          color="#fc6b4b"
          fontWeight={600}
          sx={{ letterSpacing: 1 }}
        >
          Lista de Produtos
        </Typography>

        {selectedItems.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            sx={{ textTransform: "none" }}
          >
            Alterar status ({selectedItems.length} itens)
          </Button>
        )}
      </Box>

      <Divider sx={{ width: "100%", maxWidth: "95%", mb: 2, mt: 2 }} />

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

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
            mb={3}
          >
            Alteração em Massa
          </Typography>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Você selecionou {selectedItems.length} itens:
            </Typography>

            <Box
              maxHeight={300}
              overflow="auto"
              mt={2}
              mb={2}
              p={2}
              bgcolor="#f5f5f5"
              borderRadius={1}
            >
              {items
                .filter((item) => selectedItems.includes(item.id))
                .map((item) => (
                  <Box
                    key={item.id}
                    mb={1}
                    pb={1}
                    borderBottom="1px solid #ddd"
                  >
                    <Typography variant="body2">
                      <strong>Nome:</strong> {item.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Marca:</strong> {item.brand}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tamanho:</strong> {item.size}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Cor:</strong> {item.color}
                    </Typography>
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center"
                    >
                      <strong>Status:</strong>&nbsp;
                      <StatusCell status={item.status} />
                    </Typography>
                  </Box>
                ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom mt={3}>
              Selecione o novo status:
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="bulk-status-label">Status</InputLabel>
              <Select
                labelId="bulk-status-label"
                value={bulkStatus}
                onChange={handleStatusChange}
                label="Status"
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            <Typography variant="body2" color="text.secondary">
              Total: {selectedItems.length} itens selecionados
            </Typography>

            <Box>
              <Button
                onClick={closeModal}
                color="inherit"
                sx={{ mr: 2 }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleBulkUpdate}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Confirmar Alteração"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
