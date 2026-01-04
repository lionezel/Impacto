import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

export const Failure = () => {
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
          "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
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
          <CancelRoundedIcon
            sx={{ fontSize: 72, color: "error.main" }}
          />

          <Typography variant="h4" fontWeight={700}>
            Impacto
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Pago rechazado
          </Typography>

          <Typography variant="body2" color="text.secondary">
            No pudimos procesar tu pago.  
            Verifica los datos o intenta con otro método de pago.
          </Typography>

          <Stack spacing={2} width="100%">
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => navigate("/checkout")}
              sx={{
                padding: "14px",
                borderRadius: "14px",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#111" },
              }}
            >
              Intentar nuevamente
            </Button>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                padding: "14px",
                borderRadius: "14px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Volver al inicio
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
