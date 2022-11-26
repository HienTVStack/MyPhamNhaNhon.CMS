import { filter } from "lodash";
// import { sentenceCase } from "change-case";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
    Card,
    Table,
    Stack,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Snackbar,
    Alert,
    Link,
    Breadcrumbs,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import Iconify from "src/components/Iconify";
import SearchNotFound from "src/components/SearchNotFound";
import SaleOrderListHead from "src/pages/Order/SaleOrderListHead";
import { ProductListToolbar } from "src/sections/@dashboard/products";
// mock
import productApi from "src/api/productApi";
import { NumericFormat } from "react-number-format";
import Loading from "src/components/Loading";
// import MoreMenuProduct from "./MoreMenuProduct";
import { useEffect } from "react";
import { Fragment } from "react";
import saleOrderApi from "src/api/saleOrderApi";
import SaleOrderMoreMenu from "./SaleOrderMoreMenu";
import { fDate } from "src/utils/formatTime";
import { fNumber } from "src/utils/formatNumber";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "supplierName", label: "Nhà cung cấp", alignRight: false },
    { id: "createdAt", label: "Ngày tạo", alignRight: false },
    { id: "dueDate", label: "Ngày hẹn giao", alignRight: false },
    { id: "amount", label: "Số lượng", alignRight: false },
    { id: "total", label: "Tổng tiền", alignRight: false },
    { id: "status", label: "Trạng thái", alignRight: false },
    { id: "" },
];

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

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_product) => _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function SaleOrderList() {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("desc");
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState("createdAt");
    const [filterName, setFilterName] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [productList, setProductList] = useState([]);
    const [saleOrderList, SetSaleOrderList] = useState([]);
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR",
    });

    const fetchSaleOrderList = async () => {
        setLoading(true);
        try {
            const res = await saleOrderApi.getAll();
            if (res.message === "OK") {
                SetSaleOrderList(res.saleOrders);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSaleOrderList();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = saleOrderList.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveProductItem = async (id) => {
        setLoading(true);
        try {
            const res = await productApi.destroyById(id);
            if (res.message === "OK") {
                SetSaleOrderList(saleOrderList.filter((product) => product.id !== id));
                setLoading(false);
            }
            setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
        } catch (error) {
            console.log(error);
            setLoading(false);
            setToastMessage({ open: true, type: "error", message: "Có lỗi khi xóa sản phẩm" });
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - saleOrderList.length) : 0;

    const filteredUsers = applySortFilter(saleOrderList, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Fragment>
            <Page title="Product">
                <Container>
                    <Typography variant="h5" component="h5">
                        Danh sách đặt hàng
                    </Typography>
                    <Stack>
                        <Breadcrumbs separator=">" aria-label="breadcrumb">
                            {breadcrumbs}
                        </Breadcrumbs>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/dashboard/dashboard/me/saleOrder"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            Thêm mới
                        </Button>
                    </Stack>

                    <Card sx={{ mt: 2 }}>
                        {loading ? (
                            <Loading />
                        ) : (
                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table>
                                        <SaleOrderListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={saleOrderList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                // const { id, name: toOrder.name, createdAt, image, inStock, price, slug } = row;
                                                const isItemSelected = selected.indexOf(row.id) !== -1;

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={row.id}
                                                        tabIndex={-1}
                                                        role="checkbox"
                                                        selected={isItemSelected}
                                                        aria-checked={isItemSelected}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {row?.toOrder.name}
                                                                </Typography>
                                                                <Typography variant="body2">{row.id}</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {new Intl.DateTimeFormat("en-US", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            }).format(new Date(row.createdAt))}
                                                        </TableCell>
                                                        <TableCell align="left">{fDate(row?.dueDate) || new Date()}</TableCell>
                                                        <TableCell align="center" component="th" scope="row" padding="none">
                                                            {row.amount}
                                                        </TableCell>

                                                        <TableCell align="left">{`${fNumber(row?.total)} đ`}</TableCell>
                                                        <TableCell align="left">
                                                            {row.status === -1 && (
                                                                <Label variant="ghost" color="error">
                                                                    Đã hủy
                                                                </Label>
                                                            )}
                                                            {row.status === 0 && (
                                                                <Label variant="ghost" color="success">
                                                                    Tạo mới
                                                                </Label>
                                                            )}
                                                            {row.status === 1 && (
                                                                <Label variant="ghost" color="secondary">
                                                                    Đang giao
                                                                </Label>
                                                            )}
                                                            {row.status === 2 && (
                                                                <Label variant="ghost" color="warning">
                                                                    Hoàn thành
                                                                </Label>
                                                            )}
                                                            {row.status === 3 && (
                                                                <Label variant="ghost" color="warning">
                                                                    Nháp
                                                                </Label>
                                                            )}
                                                        </TableCell>

                                                        <TableCell align="right">
                                                            <SaleOrderMoreMenu
                                                                id={row.id}
                                                                product={row}
                                                                removeProductItem={handleRemoveProductItem}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>

                                        {isUserNotFound && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                        <SearchNotFound searchQuery={filterName} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        )}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={saleOrderList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Card>
                </Container>
            </Page>
            <Snackbar
                open={toastMessage.open}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                autoHideDuration={3000}
                onClose={() => setToastMessage({ open: false })}
            >
                <Alert variant="filled" hidden={3000} severity={toastMessage.type} x={{ minWidth: "200px" }}>
                    {toastMessage.message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}
