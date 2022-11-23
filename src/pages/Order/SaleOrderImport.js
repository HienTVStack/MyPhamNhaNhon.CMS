import { Fragment, useMemo, useEffect } from "react";
import { Alert, Box, Breadcrumbs, Button, Divider, Link, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import { useParams } from "react-router-dom";
import { fNumber } from "src/utils/formatNumber";
import Loading from "src/components/Loading";
import { jsPDF } from "jspdf";
import saleOrderApi from "src/api/saleOrderApi";
import { fDateTime } from "src/utils/formatTime";

const preUrls = [
    {
        preUrl: "/",
        title: "Dashboard",
    },
    {
        preUrl: "/order",
        title: "Đặt hàng",
    },
    {
        // preUrl: "/create",
        title: "Chi tiết",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));
function SaleOrderImport() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [saleOrder, setSaleOrder] = useState({});
    const [productList, setProductList] = useState([]);
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });
    // error

    const saleOrderLoaded = async (id) => {
        setLoading(true);
        try {
            const res = await saleOrderApi.getById(id);
            if (res.success) {
                setSaleOrder(res.saleOrder);
                setProductList(res.saleOrder.products);
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

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text("Hello world!", 10, 10);
        // doc.table().data;
        doc.save("a4.pdf");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const tmp = {
            status: true,
            products: productList,
            deliveryReal: new Date(),
        };

        console.log(tmp);
        try {
            const res = await saleOrderApi.import(id, tmp);
            if (res.success) {
                console.log(res);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleChangeQuantity = (e, id) => {
        const value = e.target.value;
        const newProductList = [];

        for (const item of productList) {
            if (item._id === id) {
                item.quantity = value;
            }
            newProductList.push(item);
        }
        setProductList(newProductList);
    };

    // const handleExportXLSX = () => {
    //     const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    //     const invoiceExport = [];
    //     invoiceList.map((item) => {
    //         return invoiceExport.push({
    //             name: item.name,
    //             // category: item.category.map(c => reut),
    //             // category: item.category.map((c) => c.name),
    //             type: item.type.nameType,
    //             price: `${fNumber(item.price)} VNĐ`,
    //             quantity: item.quantity,
    //             total: `${fNumber(item.total)} VNĐ`,
    //         });
    //     });

    //     const ws = XLSX.utils.json_to_sheet(invoiceExport);

    //     XLSX.utils.sheet_add_aoa(ws, [["Name", "Type", "Price", "Quantity", "Total"]], { origin: "A1" });

    //     const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    //     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    //     const data = new Blob([excelBuffer], { type: fileType });
    //     FileSaver.saveAs(data, `export.xlsx`);
    // };

    return (
        <Fragment>
            <Box sx={{ m: 2 }}>
                <Typography variant="h5" component="h5">
                    Nhập hàng
                </Typography>
                <Stack>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
                <Stack direction={"row"} mt={2}>
                    <Button onClick={handleExportPDF}>
                        <Iconify height={"25px"} width={"25px"} icon={"carbon:add-alt"} />
                    </Button>
                    <Button>
                        <Iconify height={"25px"} width={"25px"} icon={"fluent:print-20-filled"} />
                    </Button>
                    <Button>
                        <Iconify height={"25px"} width={"25px"} icon={"ant-design:download-outlined"} />
                    </Button>
                    <Button>
                        <Iconify height={"25px"} width={"25px"} icon={"bxs:share-alt"} />
                    </Button>
                </Stack>
            </Box>

            {loading ? (
                <Loading />
            ) : (
                <Paper elevation={0} sx={{ m: 2 }}>
                    <Stack direction={"row"} justifyContent="space-between" p={2}>
                        <img src="/static/media/logo.afa5c8a58f47d82a54b8.png" alt="logo" width={120} height={50} />
                        <Box>
                            <Typography variant="body1" color="secondary">
                                {saleOrder?.status || ""}
                            </Typography>

                            <Typography variant="body1" fontWeight={700} fontSize={"18px"}>
                                {saleOrder?.id}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"space-between"} p={2}>
                        <Box sx={{ width: "50%" }} p={2}>
                            <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2} mb={2}>
                                INVOICE FROM
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {saleOrder?.fromOrder?.name}
                            </Typography>
                            <p> {saleOrder?.fromOrder?.address}</p>
                            <p>Phone: {saleOrder?.fromOrder?.phone}</p>
                            <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2}>
                                DATE CREATE
                            </Typography>
                            <p>{saleOrder.createdAt && fDateTime(saleOrder.createdAt)}</p>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ width: "50%" }} p={2}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2} mb={2}>
                                    INVOICE TO
                                </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight={600}>
                                {saleOrder?.toOrder?.name}
                            </Typography>
                            <p> {saleOrder?.toOrder?.address}</p>
                            <p>Phone: {saleOrder?.toOrder?.phone}</p>
                            <Typography variant="body1" fontSize={"0.75rem"} color={"rgb(145, 158, 171)"} mt={2}>
                                DATE CREATE
                            </Typography>
                            <p>{saleOrder.dueDate && fDateTime(saleOrder.dueDate)}</p>
                        </Box>
                    </Stack>

                    <Stack p={3} component="form" noValidate onSubmit={handleSubmit}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">#</TableCell>
                                        <TableCell align="left">Sản phẩm</TableCell>
                                        <TableCell align="right">Danh mục</TableCell>
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
                                                <TableCell sx={{ maxWidth: "300px" }}>{row.name}</TableCell>
                                                <TableCell align="right">
                                                    {row.category.map((item) => (
                                                        <p key={item._id}>{item.name}</p>
                                                    ))}
                                                </TableCell>
                                                <TableCell align="right">{row.type}</TableCell>
                                                <TableCell align="right">
                                                    <TextField
                                                        sx={{ maxWidth: "70px" }}
                                                        name={`quantity${index}`}
                                                        id={`quantity${index}`}
                                                        value={row.quantity}
                                                        required
                                                        onChange={(e) => handleChangeQuantity(e, row._id)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{fNumber(row.price)}</TableCell>
                                                <TableCell align="right">{`${fNumber(row.total)} VNĐ`}</TableCell>
                                            </TableRow>
                                        ))}
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ height: "100px" }} />
                                    </TableRow>
                                    <>
                                        <TableRow>
                                            <TableCell rowSpan={3} colSpan={2} />
                                            <TableCell colSpan={2}>Tổng tiền</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(saleOrder.total)} VNĐ`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Số lượng</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(saleOrder.amount)}`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Thanh toán</TableCell>
                                            <TableCell colSpan={2}>{`${fNumber(saleOrder.total)} VNĐ`}</TableCell>
                                        </TableRow>
                                    </>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" type="submit">
                            Nhập kho
                        </Button>
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

export default SaleOrderImport;
