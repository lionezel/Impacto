import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firebase/config";
import { useAlert } from "../../../hook/useAlert";
import { GlobalAlert } from "../../../global/GlobalAlert";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { alert, showAlert, closeAlert } = useAlert();

  const handleSendLink = async () => {
    if (!email) {
      showAlert("Debes ingresar un correo electrónico", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Correo electrónico no válido", "error");
      return;
    }

    try {
      setLoading(true);

      const actionCodeSettings = {
        url: `${process.env.REACT_APP_APP_URL}/verify`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      window.localStorage.setItem("emailForSignIn", email);
      setSent(true);

      showAlert("Te enviamos un enlace de verificación a tu correo", "success");
    } catch (error) {
      showAlert(
        "No se pudo enviar el correo. Intenta nuevamente",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!sent ? (
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
            {/* LOGO */}
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

            {/* TITULO */}
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Iniciar sesión
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 3 }}
            >
              Introduce tu correo electrónico y te enviaremos un código de
              verificación
            </Typography>

            {/* INPUT */}
            <TextField
              fullWidth
              placeholder="Correo electrónico"
              variant="outlined"
              sx={{ marginBottom: 3 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            {/* BOTÓN */}
            <Button
              fullWidth
              onClick={handleSendLink}
              disabled={loading}
              sx={{
                backgroundColor: "#0f9d58",
                color: "#fff",
                padding: "14px 0",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#0c7c45",
                },
              }}
            >
              {loading ? "Enviando..." : "Continuar"}
            </Button>
          </Box>
        </Container>
      ) : (
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
              Revisa tu correo 📩
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 2 }}
            >
              Te enviamos un enlace para continuar el inicio de sesión
            </Typography>
          </Box>
        </Container>
      )}

      {/* ALERTA GLOBAL */}
      <GlobalAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeAlert}
      />
    </>
  );
};
