import { useState } from "react";
import { AlertSeverity } from "../interfaces/AlertSeverity";

export const useAlert = () => {
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info" as AlertSeverity,
    });

    const showAlert = (message: string, severity: AlertSeverity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    return {
        alert,
        showAlert,
        closeAlert,
    };
};
