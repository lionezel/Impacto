import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useAlert } from "../../../hook/useAlert";
import { GlobalAlert } from "../../../global/GlobalAlert";

export const VerifyPage = () => {
  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert();

   useEffect(() => {
    const signIn = async () => {
      try {
        showAlert("Verificando tu correo...", "info");

        const url = window.location.href;

        if (!isSignInWithEmailLink(auth, url)) {
          throw new Error("Invalid link");
        }

        const email =
          localStorage.getItem("emailForSignIn") ||
          window.prompt("Confirma tu correo");

        if (!email) throw new Error("Email requerido");

        await signInWithEmailLink(auth, email, url);

        localStorage.removeItem("emailForSignIn");

        showAlert("Inicio de sesión exitoso 🎉", "success");
        setTimeout(() => navigate("/"), 1200);
      } catch (error) {
        showAlert(
          "El enlace expiró o ya fue usado. Solicita uno nuevo.",
          "error"
        );
        setTimeout(() => navigate("/login"), 2500);
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
          <Typography variant="h4" fontWeight={700} mb={4}>
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
