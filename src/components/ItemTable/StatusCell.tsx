import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

type StatusType = "in_stock" | "last_units" | "out_of_stock" | string;

export function StatusCell({ status }: { status: StatusType }) {
  let color = "text.secondary";
  let label = status;
  let icon = null;

  if (status === "in_stock") {
    color = "success.main";
    label = "Em estoque";
    icon = <CheckCircleIcon fontSize="small" sx={{ color }} />;
  } else if (status === "last_units") {
    color = "warning.main";
    label = "Últimas unidades";
    icon = <WarningIcon fontSize="small" sx={{ color }} />;
  } else if (status === "out_of_stock") {
    color = "error.main";
    label = "Fora de estoque";
    icon = <ErrorIcon fontSize="small" sx={{ color }} />;
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
}
