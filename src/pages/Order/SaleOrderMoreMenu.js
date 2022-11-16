import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
// component
import Iconify from "src/components/Iconify";

// ----------------------------------------------------------------------

export default function SaleOrderMoreMenu({ id, removeProductItem }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteProductById = (id) => {
        removeProductItem(id);
    };

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: "100%" },
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem sx={{ color: "text.secondary" }} onClick={() => handleDeleteProductById(id)}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
                <MenuItem sx={{ color: "text.secondary" }} component={RouterLink} to={`/dashboard/me/saleOrder/${id}`}>
                    <ListItemText primary="Xem chi tiết" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
            </Menu>
        </>
    );
}
