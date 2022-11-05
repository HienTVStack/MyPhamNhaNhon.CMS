import { useRef, useState } from "react";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

export default function MoreMenuTrash({ product, restoreProductItem, deleteProductItem }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleRestoreProductItem = (product) => {
        restoreProductItem(product.id);
    };

    const handleDeleteProductItem = (product) => {
        deleteProductItem(product.id);
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
                <MenuItem sx={{ color: "text.secondary" }} onClick={() => handleRestoreProductItem(product)}>
                    <ListItemIcon>
                        <Iconify icon="clarity:backup-restore-line" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Restore" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>

                <MenuItem sx={{ color: "text.secondary" }} onClick={() => handleDeleteProductItem(product)}>
                    <ListItemIcon>
                        <Iconify icon="ant-design:delete-outlined" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Xóa vĩnh viễn" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
            </Menu>
        </>
    );
}
