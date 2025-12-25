import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase/config";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSendLink = async () => {
        const actionCodeSettings = {
            url: "http://localhost:3000/verify",
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        window.localStorage.setItem("emailForSignIn", email);
        setSent(true);
    };

    return (
        <div>
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
                        />

                        {/* BOTÓN */}
                        <Button
                            fullWidth
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
                            Continuar
                        </Button>
                    </Box>
                </Container>
            ): (
        <Typography>
          📩 Revisa tu correo y abre el link para iniciar sesión
        </Typography>
      )}
        </div>
    );
};
