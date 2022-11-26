import { Fragment, useMemo } from "react";
import { Alert, Avatar, Box, Breadcrumbs, Button, Divider, Grid, Link, Paper, Snackbar, Stack, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import { useNavigate, useParams } from "react-router-dom";
import { fNumber } from "src/utils/formatNumber";
import Loading from "src/components/Loading";
import { jsPDF } from "jspdf";
import { fDateTime } from "src/utils/formatTime";
import invoiceApi from "src/api/invoiceApi";
import html2canvas from "html2canvas";
import images from "src/assets/images";

const preUrls = [
    {
        preUrl: "/",
        title: "Dashboard",
    },
    {
        preUrl: "/order",
        title: "Hóa đơn",
    },
    {
        title: "Chi tiết",
    },
];

const COLOR_CREATE_INVOICE = "rgb(54, 179, 126)";
const COLOR_DELIVERY_INVOICE = "rgb(255, 171, 0)";
const COLOR_ERROR_INVOICE = "rgb(255, 86, 48)";

const styleTagStatus = {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    maxWidth: "150px",
};

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));
function InvoiceViewDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [invoiceItem, setInvoiceItem] = useState({});
    const [productList, setProductList] = useState([]);
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });
    const saleOrderLoaded = async (id) => {
        setLoading(true);
        try {
            const res = await invoiceApi.getById(id);
            if (res.success) {
                setInvoiceItem(res?.invoice);
                setProductList(res?.invoice?.products);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setToastMessage({ open: true, message: "Lỗi đơn hàng", type: "error" });
            setLoading(false);
        }
    };
    useMemo(() => {
        saleOrderLoaded(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleConfirmInvoice = async (value) => {
        setLoading(true);
        try {
            const res = await invoiceApi.updateStatus(id, { status: value });
            if (res.success) {
                setToastMessage({ open: true, message: "Xác nhận đơn hàng thàng công", type: "success" });
            }
            if (!res.success) {
                setToastMessage({ open: true, message: "Có lỗi xác nhận đơn", type: "warning" });
            }
            navigate("/dashboard/invoice/list");
        } catch (error) {
            console.log(error);
            setToastMessage({ open: true, message: "Có lỗi xác nhận đơn", type: "error" });
        }
        setLoading(false);
    };

    const handleDownloadToPDF = async () => {
        const invoiceElement = document.querySelector("#invoice");
        html2canvas(invoiceElement).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", [1140, 1131]);
            pdf.addImage(imgData, "PNG", 0, 0);
            pdf.save("invoice.pdf");
        });
    };
    const handlePrint = () => {
        // let invoiceElement = document.getElementById("invoice");
        // invoiceElement.focus();
        // invoiceElement.print();
        alert(`Đang cập nhật`);
    };

    return (
        <Fragment>
            <Box sx={{ m: 2 }}>
                <Typography variant="h5" component="h5">
                    Chi tiết đơn hàng
                </Typography>
                <Stack>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
                <Stack direction={"row"} mt={2} justifyContent={"space-between"} sx={{ marginBottom: "30px" }}>
                    <Stack direction={"row"}>
                        <Button>
                            <Iconify height={"25px"} width={"25px"} icon={"carbon:add-alt"} />
                        </Button>
                        <Button onClick={handlePrint}>
                            <Iconify height={"25px"} width={"25px"} icon={"fluent:print-20-filled"} />
                        </Button>
                        <Button onClick={handleDownloadToPDF}>
                            <Iconify height={"25px"} width={"25px"} icon={"ant-design:download-outlined"} />
                        </Button>
                        <Button>
                            <Iconify height={"25px"} width={"25px"} icon={"bxs:share-alt"} />
                        </Button>
                    </Stack>
                    <Stack direction={"row"} spacing={4}>
                        <Button variant="contained" type="large" onClick={() => handleConfirmInvoice(1)}>
                            XÁC NHẬN ĐƠN HÀNG
                        </Button>
                        <Button variant="contained" type="large" color="error" onClick={() => handleConfirmInvoice(-1)}>
                            HUỶ ĐƠN
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {loading ? (
                <Loading />
            ) : (
                <Paper id={"invoice"} elevation={0} sx={{ m: 2 }}>
                    <Grid container spacing={2} p={2}>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <img src={images.logo} alt="logo" width={120} height={50} />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6} textAlign={"right"}>
                            <Stack alignItems={"flex-end"}>
                                <Box>
                                    {invoiceItem?.status === -1 && (
                                        <Box sx={styleTagStatus} backgroundColor={COLOR_ERROR_INVOICE}>
                                            Đã hủy
                                        </Box>
                                    )}
                                    {invoiceItem?.status === 0 && (
                                        <Box sx={styleTagStatus} backgroundColor={COLOR_CREATE_INVOICE}>
                                            Tạo mới
                                        </Box>
                                    )}
                                    {invoiceItem?.status === 1 && (
                                        <Box sx={styleTagStatus} backgroundColor={COLOR_DELIVERY_INVOICE}>
                                            Đang giao
                                        </Box>
                                    )}
                                    {invoiceItem?.status === 2 && (
                                        <Box sx={styleTagStatus} backgroundColor={"primary"}>
                                            Hoàn thành
                                        </Box>
                                    )}
                                </Box>

                                <Typography variant="body1" fontWeight={700} fontSize={"14px"}>
                                    {invoiceItem?.id}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container direction={"row"} p={2} alignItems={"center"} spacing={2}>
                        <Grid item sm={12} md={6} lg={4}>
                            <Box p={2}>
                                <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2} mb={2}>
                                    Khách hàng
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {invoiceItem?.auth?.name}
                                </Typography>
                                <p> {invoiceItem?.auth?.address}</p>
                                <p>Phone: {invoiceItem?.auth?.phone}</p>
                                <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2}>
                                    THỜI GIAN ĐẶT HÀNG
                                </Typography>
                                <Typography variant="body2">{fDateTime(invoiceItem?.createdAt || new Date())}</Typography>
                            </Box>
                        </Grid>
                        <Grid item sm={12} md={6} lg={8}>
                            <Stack justifyContent={"center"} alignItems={"center"} p={2} spacing={2}>
                                <Typography variant={"subtitle1"}>Tiệm mỹ phẩm nhà Nhơn</Typography>
                                <Typography variant={"body2"}>Địa chỉ: Thôn Khương Mỹ, xã Tam Xuân 1, huyện Núi Thành, tỉnh Quảng Nam</Typography>
                                <Typography variant={"body2"}>Điện thoại: 033.712.2712</Typography>
                                <Typography variant={"body2"}>Uy tín - chất lượng</Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Stack p={3}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">#</TableCell>
                                        <TableCell align="left">Sản phẩm</TableCell>
                                        <TableCell align="right">Loại</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Giá</TableCell>
                                        <TableCell align="right">Tổng tiền</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productList &&
                                        productList.map((row, index) => (
                                            <TableRow key={index} hover tabIndex={-1}>
                                                <TableCell>{index}</TableCell>
                                                <TableCell sx={{ maxWidth: "300px" }}>
                                                    <Stack direction={"row"} spacing={2}>
                                                        <Avatar alt="" src={row.image}></Avatar>
                                                        <Typography variant="body1">{row.name}</Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="right">{row.type}</TableCell>
                                                <TableCell align="right">{row.quantity}</TableCell>
                                                <TableCell align="right">{fNumber(row.price)}</TableCell>
                                                <TableCell align="right">{`${fNumber(row.quantity * row.price)} VNĐ`}</TableCell>
                                            </TableRow>
                                        ))}
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ height: "100px" }} />
                                    </TableRow>
                                    <>
                                        <TableRow>
                                            <TableCell rowSpan={4} colSpan={2} />
                                            <TableCell colSpan={2}>Tổng tiền</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(invoiceItem.total)} VNĐ`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Giảm giá</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(invoiceItem?.priceDiscount)}`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Phí giao hàng</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(invoiceItem?.priceDelivery)}`}</TableCell>
                                        </TableRow>
                                        {/* <TableRow>
                                            <TableCell colSpan={2}>Thanh toán</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(
                                                invoiceItem.total + invoiceItem?.priceDelivery - invoiceItem?.discount?.discountValue
                                            )} VNĐ`}</TableCell>
                                        </TableRow> */}
                                    </>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Paper>
            )}
            {/* Other */}
            <Snackbar
                open={toastMessage.open}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                autoHideDuration={2000}
                onClose={() => setToastMessage({ open: false })}
            >
                <Alert variant="filled" hidden={2000} severity={toastMessage.type} sx={{ minWidth: "200px" }}>
                    {toastMessage.message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default InvoiceViewDetail;
