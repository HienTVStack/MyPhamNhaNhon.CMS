import { useRef, useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
// component
import Iconify from "../../../components/Iconify";
import productApi from "src/api/productApi";

// ----------------------------------------------------------------------

export default function UserMoreMenu({ slug, id }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteProductById = async (id) => {
        try {
            if (id) {
                const res = await productApi.destroyById(id);

                if (res.message === "OK") {
                    console.log(`Deleted success`);
                }
            }
        } catch (error) {
            console.log(error);
        }
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

                <MenuItem component={RouterLink} to={`/dashboard/products/${slug}/edit`} sx={{ color: "text.secondary" }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Edit" primaryTypographyProps={{ variant: "body2" }} />
                </MenuItem>
            </Menu>
        </>
    );
}
