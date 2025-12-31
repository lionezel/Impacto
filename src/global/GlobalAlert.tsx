import { Alert, Snackbar } from "@mui/material";
import { AlertSeverity } from "../interfaces/AlertSeverity";

interface GlobalAlertProps {
    open: boolean;
    message: string;
    severity?: AlertSeverity;
    duration?: number;
    onClose: () => void;
    position?: {
        vertical: "top" | "bottom";
        horizontal: "left" | "center" | "right";
    };
}

export const GlobalAlert = ({
    open,
    message,
    severity = "info",
    duration = 3000,
    onClose,
    position = { vertical: "top", horizontal: "center" },
}: GlobalAlertProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={position}
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
