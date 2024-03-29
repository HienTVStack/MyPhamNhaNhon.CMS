import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from "@mui/material";
// components
import MenuPopover from "../../components/MenuPopover";
// mocks_
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: "Home",
        icon: "eva:home-fill",
        linkTo: "/",
    },
    {
        label: "Profile",
        icon: "eva:person-fill",
        linkTo: "#",
    },
    {
        label: "Settings",
        icon: "eva:settings-2-fill",
        linkTo: "#",
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const user = useSelector((state) => state.data.user);
    const navigate = useNavigate();

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        "&:before": {
                            zIndex: 1,
                            content: "''",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            position: "absolute",
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={user?.avatar || ""} alt="photoURL" />
            </IconButton>
            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    "& .MuiMenuItem-root": {
                        typography: "body2",
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.fullName || "Ẩn danh"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                {/* <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack> */}

                <Divider sx={{ borderStyle: "dashed" }} />

                <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                    Đang xuất
                </MenuItem>
            </MenuPopover>
        </>
    );
}
