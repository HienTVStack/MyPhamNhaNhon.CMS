import {
    Box,
    Button,
    FormControlLabel,
    FormGroup,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    Modal,
    InputBase,
    Checkbox,
    Divider,
} from "@mui/material";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import authApi from "src/api/authApi";
import discountApi from "src/api/discountApi";
import Iconify from "src/components/Iconify";
import Loading from "src/components/Loading";
import TypeHeading from "src/components/TypeHeading";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "600px",
    maxHeight: "700px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "12px",
    p: 4,
};

function DiscountCreate() {
    const employee = useSelector((state) => state.data.user);
    const [loading, setLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [nameDiscount, setNameDiscount] = useState("");
    const [code, setCode] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [discountValueErr, setDiscountValueErr] = useState("");

    const [customerList, setCustomerList] = useState([]);
    const [searchCustomerResult, setSearchCustomerResult] = useState([]);
    const [customerSelected, setCustomerSelected] = useState([]);

    const customerLoaded = async () => {
        try {
            const res = await authApi.getAll();

            if (res.success) {
                setCustomerList(res.userList);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        customerLoaded();
    }, []);

    const handleSetSelected = (e) => {
        setIsSelected(!isSelected);
    };
    const handleClose = () => {
        setOpen(false);
        setSearchCustomerResult([]);
    };
    const handleSearchCustomer = (e) => {
        const value = e.target.value;
        const resultSearch = customerList?.filter((item) => {
            return item.fullName.toUpperCase().includes(value.toUpperCase());
        });

        setSearchCustomerResult(resultSearch);
    };

    const handleSelectedCustomer = (e, item) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setCustomerSelected([...customerSelected, item]);
        } else {
            let tmp = [];
            tmp = customerSelected?.filter((customer) => customer.id !== item.id);
            setCustomerSelected(tmp);
        }
    };

    const handleChangeDiscountValue = (e) => {
        const value = Number(e.target.value);

        if (value < 0 || value > 100) {
            setDiscountValueErr(`Tỉ lệ giảm giá từ 0 - 100 %`);
        } else {
            setDiscountValueErr("");
            setDiscountValue(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData(e.target);

        const name = data.get("name");
        const code = data.get("code");
        const type = data.get("typeDiscount");
        const discountValue = data.get("discountValue");
        const invoiceMin = data.get("invoiceMin");
        const discountValueMax = data.get("discountValueMax");
        const startedAt = data.get("startedAt");
        const finishedAt = data.get("finishedAt");

        const voucher = {
            employee,
            name,
            code,
            type,
            discountValue,
            invoiceMin,
            discountValueMax,
            startedAt,
            finishedAt,
            isAll: isSelected,
            customers: customerSelected,
        };
        setLoading(true);
        try {
            const res = await discountApi.create(voucher);

            if (res.success) {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
            setNameDiscount("");
            setDiscountValue(0);
            setCode("");
            setCustomerSelected([]);
        }
        setLoading(false);
    };
    return (
        <Fragment>
            <TypeHeading>Thêm mới khuyến mãi</TypeHeading>
            {loading ? (
                <Loading />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Box component={"form"} onSubmit={handleSubmit}>
                            <Paper elevation={2} sx={{ padding: 2, mb: 2 }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                                    <Stack spacing={2} flex={2}>
                                        <Typography variant="body1">Tên chương trình</Typography>
                                        <TextField
                                            name="name"
                                            id="name"
                                            onChange={(e) => setNameDiscount(e.target.value)}
                                            required
                                            margin="normal"
                                            placeholder="Tên khuyến mãi"
                                            lable="Tên khuyến mãi"
                                        />
                                    </Stack>
                                    <Stack spacing={2} flex={1}>
                                        <Typography variant="body1">Mã khuyến mãi</Typography>
                                        <TextField
                                            name="code"
                                            id="code"
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                            margin="normal"
                                            placeholder="Mã khuyến mãi"
                                            lable="Mã khuyến mãi"
                                        />
                                    </Stack>
                                </Stack>
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2, mb: 2 }}>
                                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                                    TÙY CHỌN KHUYẾN MÃI
                                </Typography>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                                    <Box flex={1}>
                                        <Typography variant="body1" mb={1}>
                                            Loại khuyến mãi
                                        </Typography>
                                        <Select name="typeDiscount" required fullWidth defaultValue={1}>
                                            <MenuItem value={1}>Khuyến mãi voucher</MenuItem>
                                            <MenuItem value={2}>Giảm giá sản phẩm</MenuItem>
                                        </Select>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="body1">Giá trị* </Typography>
                                        <TextField
                                            name="discountValue"
                                            id="discountValue"
                                            onChange={handleChangeDiscountValue}
                                            required
                                            margin="normal"
                                            fullWidth
                                            placeholder="0%"
                                        />
                                    </Box>
                                </Stack>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                                    <Box flex={1}>
                                        <Typography variant="body1">Giá trị hóa đơn tối thiểu</Typography>
                                        <TextField
                                            name="invoiceMin"
                                            id={"invoiceMin"}
                                            defaultValue={0}
                                            margin="normal"
                                            fullWidth
                                            placeholder={"0 đ"}
                                        />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="body1">Giảm tối đa</Typography>
                                        <TextField name="discountValueMax" id={"discountValueMax"} margin="normal" fullWidth placeholder="0 đ" />
                                    </Box>
                                </Stack>
                                <Divider sx={{ mt: 4, mb: 4 }} />
                                <Stack spacing={2}>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                                        THỜI GIAN ÁP DỤNG
                                    </Typography>
                                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2} mb={2}>
                                        <Box flex={1}>
                                            <Typography variant="body1">Ngày bắt đầu</Typography>
                                            <TextField type={"date"} id="startedAt" name="startedAt" margin="normal" fullWidth />
                                        </Box>
                                        <Box flex={1}>
                                            <Typography variant="body1">Ngày kết thúc</Typography>
                                            <TextField type={"date"} id="finishedAt" name="finishedAt" margin="normal" fullWidth />
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>
                            <Button variant="contained" size="large" type="submit">
                                Tạo chương trình
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Paper elevation={2} sx={{ marginBottom: 2, p: 2 }}>
                            <Typography variant="body1" fontSize={18} fontWeight={600}>
                                Tổng quan
                            </Typography>
                            <Stack p={2}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "150px",
                                        background: "linear-gradient(to right, #348f50, #56b4d3)",
                                        borderRadius: "12px",
                                        padding: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                        <Typography variant="body1" fontSize={24} color={"#fff"}>
                                            {discountValue || "0"} %
                                        </Typography>
                                        <Typography variant="body1" fontSize={24} color={"#fff"}>
                                            {code.toUpperCase() || "CODE"}
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ borderColor: "#fff", borderStyle: "dashed" }} />
                                    <Typography variant="body1" color={"#fff"}>
                                        {nameDiscount || "Tên chương trình"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="body1" fontSize={18} fontWeight={600}>
                                Tổng quan
                            </Typography>
                            <FormGroup>
                                <FormControlLabel control={<Switch onChange={handleSetSelected} checked={isSelected} />} label="Áp dụng cho tất cả" />
                            </FormGroup>

                            <Box>
                                <Button startIcon={<Iconify icon="material-symbols:add" />} onClick={handleOpen}>
                                    Thêm mới
                                </Button>
                                {customerSelected?.map((item, index) => (
                                    <Stack key={index} direction="row" justifyContent="space-between" sx={{ borderBottom: "1px solid #ccc" }}>
                                        <Box sx={{ textDecoration: isSelected && "line-through" }}>
                                            <Typography variant="body1">{item.fullName}</Typography>
                                            <Typography variant="body2">{item?.email || item?.emailGoogle || item?.emailFacebook}</Typography>
                                        </Box>
                                        <Button onClick={(event) => handleSelectedCustomer(event, item)} startIcon={<Iconify icon="uil:trash-alt" />}>
                                            Loại bỏ
                                        </Button>
                                    </Stack>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Modal open={open} onClose={handleClose} disableEnforceFocus disableAutoFocus disableEscapeKeyDown disablePortal>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" fontSize={18} lineHeight={"30px"} fontWeight={600} textAlign={"center"} mb={2}>
                        TÙY CHỌN KHÁCH HÀNG
                    </Typography>
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        sx={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "12px", mb: 2, mt: 2 }}
                    >
                        <InputBase sx={{ flex: 1 }} placeholder={"Tìm tên khách hàng"} onChange={handleSearchCustomer} name="search" id="search" />
                        <Iconify icon="ic:round-search" sx={{ height: 25, width: 25 }} />
                    </Stack>
                    {searchCustomerResult?.length > 0 &&
                        searchCustomerResult?.map((item, index) => (
                            <Stack key={index} direction={"row"} alignItems={"center"} sx={{ margin: "10px 0", borderBottom: "1px solid #ccc" }}>
                                <Checkbox name={item.id} id={item.id} onChange={(event) => handleSelectedCustomer(event, item)} />
                                <Box htmlFor={item.id} component={"label"} sx={{ flex: 1 }}>
                                    <Typography variant="body1">{item.fullName}</Typography>
                                    <Typography variant="body2">{item?.email || item?.emailGoogle || item?.emailFacebook}</Typography>
                                </Box>
                            </Stack>
                        ))}
                </Box>
            </Modal>
        </Fragment>
    );
}

export default DiscountCreate;
