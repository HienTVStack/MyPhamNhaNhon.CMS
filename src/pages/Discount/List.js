import {
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Modal,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Link,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import TypeHeading from "src/components/TypeHeading";
import discountApi from "src/api/discountApi";
import Loading from "src/components/Loading";
import { fDate } from "src/utils/formatTime";
import { fNumber } from "src/utils/formatNumber";
import { Link as RouteLink } from "react-router-dom";

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

const styleTitleMain = {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "24px",
};

const styleSubtitle = {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "24px",
};

const preUrls = [
    {
        preUrl: "/",
        title: "Trang chủ",
    },
    {
        preUrl: "/discount",
        title: "Khuyến mãi",
    },
    {
        preUrl: "/list",
        title: "Danh sách",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

function DiscountList() {
    const [loading, setLoading] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    const [discountItemSelected, setDiscountItemSelected] = useState({});

    const fetchDiscountList = async () => {
        try {
            setLoading(true);
            const res = await discountApi.getAll();
            if (res.success) {
                setDiscounts(res.discounts);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscountList();
    }, []);

    const handleOpen = (discountItem) => {
        setDiscountItemSelected(discountItem);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeStatus = async (status, id) => {
        try {
            const res = await discountApi.updateStatus(id, { status: !status });
            if (res.success) {
                handleClose();
                fetchDiscountList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            <Stack direction={"row"} justifyContent={"space-between"} mb={4}>
                <Box>
                    <TypeHeading variant="body1" fontSize={24}>
                        Chương trình khuyến mãi
                    </TypeHeading>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Box>
                <Button component={RouteLink} to="/dashboard/discount/create" variant="contained" startIcon={<Iconify icon="material-symbols:add" />}>
                    Tạo khuyến mãi
                </Button>
            </Stack>
            <Divider />
            {loading ? (
                <Loading />
            ) : (
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="body1" fontSize={18} fontWeight={600}>
                        Tất cả khuyến mãi
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="left">Tên chương trình</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                    <TableCell>Tỉ lệ giảm</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discounts?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant={"body1"}>{item?.name}</Typography>
                                            <Typography variant="body2">
                                                Thể loại: {item.type === 1 ? "Cho khách hàng" : "Cho tổng hóa đơn"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{fDate(item.createdAt)}</TableCell>
                                        <TableCell>{fDate(item.finishedAt)}</TableCell>
                                        <TableCell>{`${item.discountValue} %`}</TableCell>
                                        <TableCell sx={{ color: item.status ? "#A2D9AF" : "warning" }}>
                                            {item.status ? "Đang hoạt động" : "Hết hạn"}
                                        </TableCell>
                                        <TableCell onClick={() => handleOpen(item)}>
                                            <Button variant="text">Xem chi tiết</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            <Modal open={open} onClose={handleClose} disableEnforceFocus disableAutoFocus disableEscapeKeyDown disablePortal>
                <Stack sx={style} spacing={3}>
                    <Typography variant="body1" fontSize={24} fontWeight={600} textAlign={"center"} color={"primary"}>
                        Phiếu giảm giá
                    </Typography>
                    <Stack>
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
                                    {discountItemSelected?.discountValue || "0"} %
                                </Typography>
                                <Typography variant="body1" fontSize={24} color={"#fff"}>
                                    {discountItemSelected?.code?.toUpperCase() || "CODE"}
                                </Typography>
                            </Stack>
                            <Divider sx={{ borderColor: "#fff", borderStyle: "dashed" }} />
                            <Typography variant="body1" color={"#fff"}>
                                {discountItemSelected?.nameDiscount || "Tên chương trình"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography variant="subtitle1" textAlign={"center"}>
                        THÔNG TIN CHI TIẾT
                    </Typography>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                        <Typography variant="body1" sx={styleTitleMain}>
                            Ngày bắt đầu
                        </Typography>
                        <Typography variant="body1" sx={styleSubtitle}>
                            {fDate(discountItemSelected?.startedAt || new Date())}
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                        <Typography variant="body1" sx={styleTitleMain}>
                            Ngày kết thúc
                        </Typography>
                        <Typography variant="body1" sx={styleSubtitle}>
                            {fDate(discountItemSelected?.finishedAt || new Date())}
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                        <Typography variant="body1" sx={styleTitleMain}>
                            Giảm tối đa
                        </Typography>
                        <Typography variant="body1" sx={styleSubtitle}>
                            {`${fNumber(discountItemSelected?.discountValueMax || 0)} đ`}
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                        <Typography variant="body1" sx={styleTitleMain}>
                            Trạng thái
                        </Typography>
                        <Button variant="outlined" onClick={() => handleChangeStatus(discountItemSelected?.status, discountItemSelected?.id)}>
                            {discountItemSelected?.status === true ? "Dừng chương trình" : "Tiếp tục chương trình"}
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
        </Fragment>
    );
}

export default DiscountList;
