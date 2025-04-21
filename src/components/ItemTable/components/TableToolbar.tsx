import { Box, Typography, Button, Divider } from "@mui/material";

interface TableToolbarProps {
  title: string;
  selectedCount: number;
  onBulkAction?: () => void;
  actionLabel?: string;
}

export function TableToolbar({
  title,
  selectedCount,
  onBulkAction,
  actionLabel = "Alterar status",
}: TableToolbarProps) {
  return (
    <>
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
          {title}
        </Typography>

        {selectedCount > 0 && onBulkAction && (
          <Button
            variant="contained"
            color="primary"
            onClick={onBulkAction}
            sx={{ textTransform: "none" }}
          >
            {actionLabel} ({selectedCount} itens)
          </Button>
        )}
      </Box>

      <Divider sx={{ width: "100%", maxWidth: "95%", mb: 2, mt: 2 }} />
    </>
  );
}
