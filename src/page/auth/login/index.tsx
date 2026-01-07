import { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { getFunctions, httpsCallable } from "firebase/functions";
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

      const functions = getFunctions(undefined, "us-central1");
      const sendSigninLink = httpsCallable(functions, "sendSigninLink");

      await sendSigninLink({ email });

      setSent(true);
      showAlert("Revisa tu correo 📩", "success");
    } catch (err) {
      console.error(err);
      showAlert("No se pudo enviar el enlace", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!sent ? (
        <Container maxWidth={false} sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: 420, p: "48px 40px", border: "1px solid #eee", textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} mb={4}>
              Impacto
            </Typography>
            <Typography variant="h6" mb={1}>Iniciar sesión</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Introduce tu correo y te enviaremos un enlace
            </Typography>

            <TextField
              fullWidth
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              onClick={handleSendLink}
              disabled={loading}
              sx={{
                backgroundColor: "#0f9d58",
                color: "#fff",
                py: 1.6,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#0c7c45" },
              }}
            >
              {loading ? "Enviando..." : "Continuar"}
            </Button>
          </Box>
        </Container>
      ) : (
        <Container maxWidth={false} sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: 420, p: "48px 40px", border: "1px solid #eee", textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} mb={4}>
              Impacto
            </Typography>
            <Typography variant="h6">Revisa tu correo 📩</Typography>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Te enviamos un enlace para continuar
            </Typography>
          </Box>
        </Container>
      )}

      <GlobalAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeAlert}
      />
    </>
  );
};
