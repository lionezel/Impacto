import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../../../firebase/config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useAlert } from "../../../../hook/useAlert";
import { GlobalAlert } from "../../../../global/GlobalAlert";

export const Success = () => {
  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    const signIn = async () => {
      try {
        showAlert("Verificando tu correo...", "info");

        if (!isSignInWithEmailLink(auth, window.location.href)) {
          showAlert("El enlace no es válido.", "error");
          return;
        }

        const email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          showAlert(
            "Abre el enlace desde el mismo navegador donde solicitaste el acceso.",
            "warning"
          );
          setTimeout(() => navigate("/login"), 2500);
          return;
        }

        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem("emailForSignIn");

        showAlert("Correo verificado correctamente 🎉", "success");
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          showAlert("Bienvenido de nuevo 👋", "success");
          return;
        }

        showAlert("El enlace expiró o ya fue usado.", "error");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    signIn();
  }, []);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
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
            <CheckCircleRoundedIcon
              sx={{ fontSize: 72, color: "success.main" }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              Impacto
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Pago realizado con éxito
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Tu transacción fue procesada correctamente.  
              Ya puedes continuar navegando en la tienda.
            </Typography>

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                marginTop: 2,
                padding: "14px",
                borderRadius: "14px",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#111",
                },
              }}
            >
              Volver al inicio
            </Button>
          </Stack>
        </Box>
      </Container>

      <GlobalAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeAlert}
      />
    </>
  );
};
