import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

export const Pending = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #fffbe6 0%, #ffffff 100%)",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          padding: { xs: "32px 24px", sm: "48px 40px" },
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={64} />

          <Typography variant="h4" fontWeight={700}>
            Impacto
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Pago pendiente
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Tu pago está siendo procesado.  
            Te notificaremos cuando se confirme.
          </Typography>

          <Stack spacing={2} width="100%">
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                padding: "14px",
                borderRadius: "14px",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#111" },
              }}
            >
              Volver al inicio
            </Button>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={() => navigate("/orders")}
              sx={{
                padding: "14px",
                borderRadius: "14px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Ver estado del pago
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
