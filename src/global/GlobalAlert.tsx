import { Alert, Snackbar } from "@mui/material";
import { AlertSeverity } from "../interfaces/AlertSeverity";

interface GlobalAlertProps {
    open: boolean;
    message: string;
    severity?: AlertSeverity;
    duration?: number;
    onClose: () => void;
}

export const GlobalAlert = ({
    open,
    message,
    severity = "info",
    duration = 3000,
    onClose,
}: GlobalAlertProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
                position: "fixed",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: (theme) => theme.zIndex.modal + 1, 
            }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
