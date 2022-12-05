import { useState } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import LoadingButton from "@mui/lab/LoadingButton";

function EditCategory(props) {
    const { submit, loading, category } = props;
    const { id, name, description } = category;

    const [nameErr, setNameErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const name = data.get("name");
        const description = data.get("description");

        if (name === "") {
            setNameErr("Tên danh mục không được để trống");
            return;
        }
        submit({ id, name, description });
    };

    return (
        <Box mt={3} component={"form"} onSubmit={handleSubmit}>
            <Stack direction={"row"} alignItems={"center"} mb={2} spacing={1}>
                <Typography variant={"body2"} width={120}>
                    Tên danh mục
                </Typography>
                <TextField
                    fullWidth
                    name={"name"}
                    size={"small"}
                    id={"name"}
                    defaultValue={name}
                    placeholder={"Tên danh mục"}
                    label={"Tên danh mục"}
                    required
                    error={nameErr !== ""}
                    helperText={nameErr}
                />
            </Stack>
            <Stack direction={"row"} alignItems={"center"} mb={2} spacing={1}>
                <Typography variant={"body2"} width={120}>
                    Mô tả
                </Typography>
                <TextField
                    fullWidth
                    multiline={true}
                    minRows={3}
                    maxRows={5}
                    defaultValue={description}
                    name={"description"}
                    size={"small"}
                    id={"description"}
                    placeholder={"Mô tả"}
                    label={"Mô tả"}
                />
            </Stack>
            <LoadingButton
                loading={loading}
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                startIcon={<Iconify icon={"material-symbols:save"} />}
            >
                Lưu
            </LoadingButton>
        </Box>
    );
}

export default EditCategory;
