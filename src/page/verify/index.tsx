import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useAlert } from "../../hook/useAlert";
import { GlobalAlert } from "../../global/GlobalAlert";


export const VerifyPage = () => {
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
      setTimeout(() => navigate("/"), 1200);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("Bienvenido de nuevo 👋", "success");
        setTimeout(() => navigate("/"), 1200);
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
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            width: 420,
            padding: "48px 40px",
            border: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "serif",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Impacto
          </Typography>

          <Typography variant="h6">
            Verificando correo electrónico…
          </Typography>
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
