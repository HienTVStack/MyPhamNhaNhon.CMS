import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider, Link } from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

export default function MoreMenuProduct({ product, removeProductItem }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteProductById = (product) => {
        removeProductItem(product.id);
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
                <MenuItem
                    component={Link}
                    href={`https://myphamnhanhon-ui.vercel.app/san-pham/${product.slug}/chi-tiet`}
                    sx={{ color: "text.secondary" }}
                >
                    <ListItemIcon>
                        <Iconify icon="carbon:view" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Xem chi tiết" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
                <MenuItem component={RouterLink} to={`/dashboard/products/${product.slug}/edit`} sx={{ color: "text.secondary" }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-outline" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Chỉnh sửa" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
                <Divider />
                <MenuItem sx={{ color: "red" }} onClick={() => handleDeleteProductById(product)}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" sx={{ color: "red" }} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Xóa bỏ" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
            </Menu>
        </>
    );
}
