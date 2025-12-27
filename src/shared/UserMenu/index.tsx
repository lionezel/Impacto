import { useState } from "react";
import {
    Box,
    Menu,
    MenuItem,
    Typography,
    Divider,
    IconButton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { NavLink } from "react-router-dom";

interface Props {
    email: string;
}

export const UserMenu = ({ email }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut(auth);
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleOpen}>
                <PersonOutlineIcon sx={{ color: "#fff", fontSize: 26, mt: -1 }} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        width: 240,
                        mt: 1.5,
                        borderRadius: 1,
                        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                        {email}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem component={NavLink} to="/profile">
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Perfil
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <SettingsIcon sx={{ mr: 1 }} />
                    Configuración
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Cerrar sesión
                </MenuItem>
            </Menu>
        </>
    );
};
