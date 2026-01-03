import { createContext, useContext, useState } from "react";
import { AlertSeverity } from "../interfaces/AlertSeverity";
import { GlobalAlert } from "../global/GlobalAlert";

interface AlertState {
    open: boolean;
    message: string;
    severity: AlertSeverity;
}

interface AlertContextProps {
    showAlert: (message: string, severity?: AlertSeverity) => void;
}

const AlertContext = createContext<AlertContextProps | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: "",
        severity: "info",
    });

    const showAlert = (message: string, severity: AlertSeverity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <GlobalAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={closeAlert}
            />
        </AlertContext.Provider>
    );
};

export const useGlobalAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useGlobalAlert debe usarse dentro de AlertProvider");
    return ctx;
};
