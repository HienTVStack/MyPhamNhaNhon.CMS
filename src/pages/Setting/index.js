import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import settingApi from "src/api/settingApi";
import Iconify from "src/components/Iconify";
import Loading from "src/components/Loading";

function Setting() {
    const navigate = useNavigate();
    const [settingData, setSettingData] = useState({});
    const [loading, setLoading] = useState(false);
    const [bannerList, setBannerList] = useState([{ imageUrl: "", href: "" }]);

    const fetch = async () => {
        setLoading(true);
        try {
            const res = await settingApi.get();
            if (res.success) {
                setSettingData(res.setting);
                setBannerList(res?.setting?.banners);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleInputTypeProductChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...bannerList];
        list[index][name] = value;
        setBannerList(list);
    };
    const handleAddInputTypeClick = (e, index) => {
        setBannerList([...bannerList, { imageUrl: "", href: "" }]);
    };

    const handleRemoveInputType = (index) => {
        const list = [...bannerList];
        list.splice(index, 1);
        setBannerList(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const shopName = data.get("shopName");
        const phone = data.get("phone");
        const address = data.get("address");
        const facebook = data.get("facebook");
        const instagram = data.get("instagram");
        const email = data.get("email");

        const setting = {
            shopName,
            phone,
            address,
            socials: {
                facebook,
                instagram,
                email,
            },
            banners: bannerList,
        };

        setLoading(true);

        try {
            const res = await settingApi.update(setting);
            if (res.success) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <Stack>
            <Typography variant="body1" fontSize={24}>
                Cài đặt
            </Typography>
            {loading ? (
                <Loading />
            ) : (
                <Box component={"form"} onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Fragment>
                            <Paper elevation={2} sx={{ padding: 2 }}>
                                <Typography>THÔNG TIN CỬA HÀNG</Typography>
                                <Box>
                                    <Typography variant="subtitle1">Tên cửa hàng</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.shopName}
                                        fullWidth
                                        placeholder="Tên cửa hàng"
                                        name="shopName"
                                        id="shopName"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1">Số điện thoại</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.phone}
                                        fullWidth
                                        placeholder="Số điện thoại"
                                        label="Số điện thoại"
                                        name="phone"
                                        id="phone"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1">Địa chỉ</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.address}
                                        fullWidth
                                        placeholder="Địa chỉ"
                                        label="Địa chỉ"
                                        name="address"
                                        id="address"
                                    />
                                </Box>
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2 }}>
                                <Typography>MẠNG XÃ HỘI</Typography>
                                <Box>
                                    <Typography variant="subtitle1">Facebook</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.socials?.facebook}
                                        fullWidth
                                        placeholder="Tên cửa hàng"
                                        name="facebook"
                                        id="facebook"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1">Instagram</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.socials?.instagram}
                                        fullWidth
                                        placeholder="Tên cửa hàng"
                                        name="instagram"
                                        id="instagram"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1">Email</Typography>
                                    <TextField
                                        margin="normal"
                                        defaultValue={settingData?.socials?.email}
                                        fullWidth
                                        placeholder="Tên cửa hàng"
                                        name="email"
                                        id="email"
                                    />
                                </Box>
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2 }}>
                                <Typography>CÀI ĐẶT KHÁC</Typography>
                                <Stack direction={"row"} spacing={2}>
                                    <Typography variant="subtitle1">Banner</Typography>
                                    <Stack spacing={2} flex={1}>
                                        {bannerList?.map((x, index) => {
                                            return (
                                                <Stack spacing={1} key={index}>
                                                    <Stack direction={"row"} spacing={2}>
                                                        <TextField
                                                            fullWidth
                                                            name={"imageUrl"}
                                                            id={"imageUrl"}
                                                            value={x.imageUrl}
                                                            onChange={(e) => handleInputTypeProductChange(e, index)}
                                                            placeholder={`Link ảnh baner ${index + 1}`}
                                                            label={`Link ảnh baner ${index + 1}`}
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            name={"href"}
                                                            id={"href"}
                                                            value={x.href}
                                                            onChange={(e) => handleInputTypeProductChange(e, index)}
                                                            placeholder="Chuyển hướng đến"
                                                            label={"Chuyển hướng đến"}
                                                        />
                                                        {bannerList.length !== 1 && (
                                                            <IconButton onClick={handleRemoveInputType} color="error" variant="text">
                                                                <Iconify icon="material-symbols:delete-rounded" />
                                                            </IconButton>
                                                        )}
                                                    </Stack>
                                                    <Button
                                                        onClick={handleAddInputTypeClick}
                                                        startIcon={<Iconify icon={"material-symbols:add"} />}
                                                        variant="outlined"
                                                        sx={{ maxWidth: "200px" }}
                                                    >
                                                        Add item
                                                    </Button>
                                                </Stack>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Fragment>
                    </Stack>
                    <Button variant={"contained"} type="submit" size="large" sx={{ maxWidth: 220, mt: 2 }}>
                        Lưu thay đổi
                    </Button>
                </Box>
            )}
        </Stack>
    );
}

export default Setting;
