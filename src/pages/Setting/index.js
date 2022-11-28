import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";

function Setting() {
    return (
        <Stack>
            <Typography variant="body1" fontSize={24}>
                Cài đặt
            </Typography>
            <Stack spacing={2}>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography>THÔNG TIN CỬA HÀNG</Typography>
                    <Box>
                        <Typography variant="subtitle1">Tên cửa hàng</Typography>
                        <TextField margin="normal" fullWidth placeholder="Tên cửa hàng" name="storeName" id="storeName" />
                    </Box>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography>MẠNG XÃ HỘI</Typography>
                    <Box>
                        <Typography variant="subtitle1">Facebook</Typography>
                        <TextField margin="normal" fullWidth placeholder="Tên cửa hàng" name="facebookLink" id="facebookLink" />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">Instagram</Typography>
                        <TextField margin="normal" fullWidth placeholder="Tên cửa hàng" name="instagramLink" id="instagramLink" />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">Email</Typography>
                        <TextField margin="normal" fullWidth placeholder="Tên cửa hàng" name="emailLink" id="emailLink" />
                    </Box>
                </Paper>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography>CÀI ĐẶT KHÁC</Typography>
                    <Stack direction={"row"} spacing={2}>
                        <Typography variant="subtitle1">Banner</Typography>
                        <Stack spacing={2} flex={1}>
                            <Stack direction={"row"} spacing={2}>
                                <TextField fullWidth placeholder="Link ảnh baner 1" label="Link ảnh banner 1" />
                                <TextField fullWidth placeholder="Chuyển hướng đến" label={"Chuyển hướng đến"} />
                            </Stack>
                            <Stack direction={"row"} spacing={2}>
                                <TextField fullWidth placeholder="Link ảnh baner 2" label="Link ảnh banner 1" />
                                <TextField fullWidth placeholder="Chuyển hướng đến" label={"Chuyển hướng đến"} />
                            </Stack>
                            <Stack direction={"row"} spacing={2}>
                                <TextField fullWidth placeholder="Link ảnh baner 3" label="Link ảnh banner 1" />
                                <TextField fullWidth placeholder="Chuyển hướng đến" label={"Chuyển hướng đến"} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
            <Button variant={"contained"} type="large" sx={{ maxWidth: 220, mt: 2 }}>
                Lưu thay đổi
            </Button>
        </Stack>
    );
}

export default Setting;
