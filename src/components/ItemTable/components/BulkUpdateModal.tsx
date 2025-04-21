import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { Item } from "../../../domain/item";
import { StatusCell } from "../StatusCell";
import { formatCurrency } from "../../../utils/formatters";
import { STATUS_OPTIONS } from "../../../utils/constants";

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: number[];
  items: Item[];
  onUpdateStatus: (status: string) => Promise<void>;
  isSubmitting: boolean;
}

export function BulkUpdateModal({
  isOpen,
  onClose,
  selectedItems,
  items,
  onUpdateStatus,
  isSubmitting,
}: BulkUpdateModalProps) {
  const [bulkStatus, setBulkStatus] = useState<string>("in_stock");

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setBulkStatus(event.target.value);
  };

  const handleSubmit = async () => {
    await onUpdateStatus(bulkStatus);
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#e0e0e0" }}>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Nome
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Marca
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Tamanho
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Cor
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Preço
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((item) => selectedItems.includes(item.id))
                  .map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #ddd",
                        backgroundColor: index % 2 ? "#f9f9f9" : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px" }}>{item.name}</td>
                      <td style={{ padding: "10px" }}>{item.brand}</td>
                      <td style={{ padding: "10px" }}>{item.size}</td>
                      <td style={{ padding: "10px" }}>{item.color}</td>
                      <td style={{ padding: "10px" }}>
                        {formatCurrency(item.price)}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <StatusCell status={item.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
              onClick={onClose}
              color="inherit"
              sx={{ mr: 2 }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
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
  );
}
