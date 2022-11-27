import { Stack, Typography } from "@mui/material";

function PopupInfo({ name, address, phone, selectItem }) {
    const handleSelectItem = (value) => {
        selectItem(value);
    };
    return (
        <Stack
            direction="column"
            mt={2}
            mb={2}
            p={1}
            onClick={() => handleSelectItem({ name, address, phone })}
            sx={{ cursor: "pointer", borderRadius: "12px", "&:hover": { backgroundColor: "rgba(145, 158, 171, 0.08)" } }}
        >
            <Typography variant="body1" component={"h6"} color="primary" fontWeight={600}>
                {name}
            </Typography>
            <p>{address}</p>
            <p>Phone: {phone}</p>
        </Stack>
    );
}

export default PopupInfo;
