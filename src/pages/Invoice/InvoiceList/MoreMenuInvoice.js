import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

export default function MoreMenuInvoice(props) {
    const { id } = props;
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

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
                <MenuItem component={RouterLink} to={`/dashboard/invoice/${id}/detail`} primary="Xem chi tiết" sx={{ color: "text.secondary" }}>
                    <ListItemIcon>
                        <Iconify icon="carbon:view" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Xem chi tiết" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
                <MenuItem component={RouterLink} to={`/dashboard/invoice/${id}/edit`} sx={{ color: "text.secondary" }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-outline" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Chỉnh sửa" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
                <Divider />
                <MenuItem sx={{ color: "red" }}>
                    <ListItemIcon>
                        <Iconify icon="clarity:trash-line" width={24} height={24} sx={{ color: "red" }} />
                    </ListItemIcon>
                    <ListItemText primary="Xóa" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
            </Menu>
        </>
    );
}
