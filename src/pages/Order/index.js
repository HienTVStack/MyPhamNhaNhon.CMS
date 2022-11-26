import { Fragment } from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Modal,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { v4 as uuidv4 } from "uuid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import productApi from "src/api/productApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Iconify from "src/components/Iconify";
import { useNavigate } from "react-router-dom";
import { fNumber } from "src/utils/formatNumber";
import Loading from "src/components/Loading";
import OrderMoreMenu from "./SaleOrderMoreMenu";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import saleOrderApi from "src/api/saleOrderApi";
import PopupInfo from "./PopupInfo";

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
        preUrl: "/create",
        title: "Tạo mới",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 445,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    borderRadius: "20px",
};

function totalQuantityInvoice(invoice) {
    let quantity = 0;
    for (const item of invoice) {
        quantity += Number(item.quantity);
    }
    return quantity;
}

function totalPriceInvoice(invoice) {
    let total = 0;
    for (const item of invoice) {
        total += Number(item.total);
    }
    return total;
}

const SUPPLIER_LIST = [
    {
        name: "Mỹ phẩm thiên nhiên Linh Hương",
        address: "BT13 Dãy 16B5 Làng Việt Kiều Châu Âu, Mộ Lao, Hà Đông, Hà Nội",
        phone: "02432989989",
    },
    {
        name: "Tiệm mỹ phẩm nhà Nhơn chi nhánh 2",
        address: "Phường Tân Thới Nhất, quận 12, thành phố Hồ Chí Minh",
        phone: "0337122712",
    },
];

function Order() {
    const navigate = useNavigate();
    const categories = useSelector((state) => state.data.categoryList);
    const user = useSelector((state) => state.data.user);
    const [open, setOpen] = useState(false);
    const [dateCreate, setDateCreate] = useState(new Date());
    const [dateDue, setDateDue] = useState(null);
    const [code, setCode] = useState("");
    const [status, setStatus] = useState(0);
    const [productList, setProductList] = useState([]);
    const [productSelected, setProductSelected] = useState({});
    const [quantityProductItem, setQuantityProductItem] = useState(1);
    const [categoryProductSelected, setCategoryProductSelected] = useState([]);
    const [typeProductSelected, setTypeProductSelected] = useState({});
    const [typeProductList, setTypeProductList] = useState([]);
    const [invoiceList, setInvoiceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [supplier, setSupplier] = useState({});

    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });
    // error
    const [nameProductErr, setNameProductErr] = useState("");

    const productLoaded = async () => {
        setLoading(true);
        try {
            const res = await productApi.getAll();
            if (res.message === "OK") {
                setProductList(res.products);
                setProductSelected(res.products[0]);
                setCategoryProductSelected(res.products[0].category);
                setTypeProductList(res.products[0].type || []);
                setTypeProductSelected(res.products[0].type[0]);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        productLoaded();
    }, [navigate]);

    const handleAddProductToInvoice = (e) => {
        let err = false;
        if (productSelected.name === undefined) {
            err = true;
            setNameProductErr("Chọn sản phẩm ");
        }
        if (err) return;

        const productItem = {
            key: uuidv4(),
            name: productSelected.name,
            quantity: quantityProductItem,
            category: categoryProductSelected,
            type: typeProductSelected,
            price: productSelected.price,
            total: productSelected.price * quantityProductItem,
        };

        setInvoiceList([...invoiceList, productItem]);
        setToastMessage({ open: true, type: "success", message: `Thêm thành công ${productItem.name}` });
        setQuantityProductItem(1);
    };

    const handleSelectedProduct = (value) => {
        setNameProductErr("");
        setProductSelected(value);
        setTypeProductList(value.type);
        setTypeProductSelected(value.type[0]);
        setCategoryProductSelected(value.category);
    };

    const handleDeletedProductInvoice = (id) => {
        setInvoiceList(invoiceList.filter((item) => item.key !== id));
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text("Hello world!", 10, 10);
        // doc.table().data;
        doc.save("a4.pdf");
    };

    const handleExportXLSX = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const invoiceExport = [];
        invoiceList.map((item) => {
            return invoiceExport.push({
                name: item.name,
                // category: item.category.map(c => reut),
                // category: item.category.map((c) => c.name),
                type: item.type.nameType,
                price: `${fNumber(item.price)} VNĐ`,
                quantity: item.quantity,
                total: `${fNumber(item.total)} VNĐ`,
            });
        });

        const ws = XLSX.utils.json_to_sheet(invoiceExport);

        XLSX.utils.sheet_add_aoa(ws, [["Name", "Type", "Price", "Quantity", "Total"]], { origin: "A1" });

        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `export.xlsx`);
    };

    const handleOrder = async () => {
        let err = false;
        if (!dateDue) {
            err = true;
        }
        if (!supplier) {
            err = true;
        }
        if (invoiceList.length === 0) {
            err = true;
        }
        if (err) {
            setToastMessage({
                open: true,
                type: "warning",
                message: "Kiểm tra lại",
            });
            return;
        }

        const newSaleOrderProductArray = [];
        for (const item of invoiceList) {
            newSaleOrderProductArray.push({
                name: item.name,
                quantity: item.quantity,
                category: item.category,
                type: item.type.nameType,
                price: item.price,
                total: item.total,
            });
        }
        const invoice = {
            fromOrder: {
                name: "Tiệm mỹ phẩm nhà Nhơn",
                address: "Thôn Khương Mỹ, xã Tam Xuân 1, h.Núi Thành, t.Quảng Nam",
                phone: "365-374-4961",
            },
            toOrder: supplier,
            status: Number(status),
            createdDate: dateCreate,
            dueDate: dateDue,
            products: newSaleOrderProductArray,
            description: description,
            createdBy: user.fullName,
        };

        setLoading(true);
        try {
            const res = await saleOrderApi.create(invoice);
            if (res.message === "OK") {
                setToastMessage({
                    open: true,
                    type: "success",
                    message: "Tạo đơn thành công",
                });
                setInvoiceList([]);
                navigate("/dashboard/me/list");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleSelectSupplier = (value) => {
        setSupplier(value);
        setOpen(!open);
    };

    return (
        <Fragment>
            <Box>
                <Typography variant="h3" component="h3">
                    Tạo mới đơn hàng
                </Typography>
                <Stack spacing={2}>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
            </Box>
            {/* Content */}
            {/* Form  */}
            {/* Address */}
            {loading ? (
                <Loading />
            ) : (
                <Paper elevation={0}>
                    <Stack direction={"row"} justifyContent={"space-between"} p={2}>
                        <Box sx={{ width: "50%" }} p={2}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography component={"h6"}>Form:</Typography>
                                <Button
                                    onClick={() => setToastMessage({ open: true, message: "Không có địa chỉ khác", type: "warning" })}
                                    startIcon={<Iconify icon={"clarity:edit-solid"} />}
                                >
                                    Thay đổi
                                </Button>
                            </Stack>
                            <Typography variant="body1" component={"h6"} fontWeight={600}>
                                Tiệm mỹ phẩm nhà Nhơn
                            </Typography>
                            <p>Thôn Khương Mỹ, xã Tam Xuân 1, h.Núi Thành, t.Quảng Nam</p>
                            <p>Phone: 033 712 2712</p>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ width: "50%" }} p={2}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography component={"h6"}>To:</Typography>
                                <Button onClick={() => setOpen(true)} startIcon={<Iconify icon={"clarity:edit-solid"} />}>
                                    Thay đổi
                                </Button>
                            </Stack>
                            {!!supplier && (
                                <>
                                    <Typography variant="body1" component={"h6"} fontWeight={600}>
                                        {supplier.name}
                                    </Typography>
                                    <p> {supplier.address}</p>
                                    <p> {supplier.phone}</p>
                                </>
                            )}
                        </Box>
                    </Stack>
                    {/*  */}
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        spacing={2}
                        sx={{ backgroundColor: "rgb(244, 246, 248)" }}
                        p={3}
                    >
                        <TextField
                            fullWidth
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={"Code"}
                            label={"Code"}
                            name={"code"}
                            id={"code"}
                            required
                            disabled
                        />
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Status</InputLabel>
                            <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)} displayEmpty>
                                <MenuItem value={0}>Tạo mới</MenuItem>
                                <MenuItem value={1}>Tạo và gửi</MenuItem>
                                <MenuItem value={3}>Nháp</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Ngày khởi tạo"
                                value={dateCreate}
                                onChange={(newValue) => {
                                    setDateCreate(newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Ngày giao hàng"
                                value={dateDue}
                                onChange={(newValue) => {
                                    setDateDue(newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Stack>
                    {/*  */}
                    <Stack direction={"row"} mt={2}>
                        <Button onClick={handleExportPDF}>
                            <Iconify height={"25px"} width={"25px"} icon={"carbon:add-alt"} />
                        </Button>
                        <Button>
                            <Iconify height={"25px"} width={"25px"} icon={"fluent:print-20-filled"} />
                        </Button>
                        <Button onClick={handleExportXLSX}>
                            <Iconify height={"25px"} width={"25px"} icon={"ant-design:download-outlined"} />
                        </Button>
                        <Button>
                            <Iconify height={"25px"} width={"25px"} icon={"bxs:share-alt"} />
                        </Button>
                    </Stack>
                    <Stack p={3}>
                        <Typography variant="body1" component={"h4"} fontSize={"25px"} lineHeight={"37px"} fontWeight={"600"}>
                            Chi tiết
                        </Typography>
                        <Stack spacing={3} pt={2} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Autocomplete
                                autoComplete
                                fullWidth
                                disableClearable
                                value={productSelected}
                                options={productList}
                                getOptionLabel={(option) => option.name || ""}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                onChange={(e, value) => handleSelectedProduct(value)}
                                sx={{ width: 500, margin: 0 }}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        required
                                        placeholder={"Tên sản phẩm"}
                                        label={"Tên sản phẩm"}
                                        error={nameProductErr !== ""}
                                        helperText={nameProductErr}
                                        sx={{ margin: 0 }}
                                    />
                                )}
                            />

                            <Autocomplete
                                fullWidth
                                multiple
                                disabled
                                disableListWrap
                                value={categoryProductSelected}
                                options={categories}
                                disableClearable
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                onChange={(e, value) => setCategoryProductSelected(value)}
                                sx={{ width: 450 }}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={<Iconify icon="bx:checkbox" />}
                                            checkedIcon={<Iconify icon="bx:checkbox-checked" />}
                                            checked={selected}
                                        />
                                        {option.name}
                                    </li>
                                )}
                                renderInput={(params) => <TextField {...params} label="Danh mục sản phẩm" disabled />}
                            />

                            <Autocomplete
                                autoComplete
                                fullWidth
                                disableClearable
                                value={typeProductSelected}
                                options={typeProductList}
                                getOptionLabel={(option) => option.nameType || ""}
                                isOptionEqualToValue={(option, value) => option.nameType === value.nameType}
                                onChange={(e, value) => setTypeProductSelected(value)}
                                sx={{ width: 300, margin: 0 }}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        placeholder={"Type"}
                                        label={"Type"}
                                        error={nameProductErr !== ""}
                                        helperText={nameProductErr}
                                    />
                                )}
                            />

                            <TextField
                                placeholder="Num"
                                label={"Num"}
                                value={quantityProductItem}
                                required
                                sx={{ width: 100 }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value <= 0) {
                                        setQuantityProductItem(0);
                                        return;
                                    }
                                    setQuantityProductItem(e.target.value);
                                }}
                            />
                            <TextField
                                placeholder="Price"
                                label={"Price"}
                                value={fNumber(productSelected ? productSelected.price : 0)}
                                required
                                disabled
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                                }}
                            />
                            <TextField
                                placeholder="Total"
                                label={"Total"}
                                value={fNumber(productSelected ? (productSelected.price || 0) * quantityProductItem : 0)}
                                required
                                disabled
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                                }}
                            />
                        </Stack>
                        <Stack pt={2}>
                            <Typography
                                variant="body1"
                                component={"h3"}
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            >
                                Ghi chú
                            </Typography>
                            <TextField fullWidth placeholder="Ghi chú" sx={{ mt: 1 }} />
                        </Stack>
                        <Stack justifyContent={"center"} alignItems={"center"} mt={3}>
                            <Button
                                startIcon={<Iconify icon={"carbon:add-alt"} />}
                                variant="contained"
                                size={"large"}
                                sx={{ width: "200px" }}
                                onClick={handleAddProductToInvoice}
                            >
                                Thêm vào đơn
                            </Button>
                        </Stack>
                    </Stack>
                    {/*  */}
                    {invoiceList.length > 0 && (
                        <Stack p={3}>
                            <Typography variant={"body1"} component={"h3"} fontSize={"25px"} lineHeight={"37px"} fontWeight={"600"}>
                                Danh sách
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={4}>
                                                Chi tiết
                                            </TableCell>
                                            <TableCell colSpan={3} align="left">
                                                Tổng tiền
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
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
                                        {invoiceList.map((row, index) => (
                                            <TableRow key={index} hover tabIndex={-1}>
                                                <TableCell sx={{ maxWidth: "300px" }}>{row.name}</TableCell>
                                                <TableCell align="right">
                                                    {row.category.map((item) => (
                                                        <p key={item._id}>{item.name}</p>
                                                    ))}
                                                </TableCell>
                                                <TableCell align="right">{row.type.nameType}</TableCell>
                                                <TableCell align="right">{row.quantity}</TableCell>
                                                <TableCell align="right">{fNumber(row.price)}</TableCell>
                                                <TableCell align="right">{`${fNumber(row.total)} VNĐ`}</TableCell>
                                                <TableCell align={"center"}>
                                                    <OrderMoreMenu id={row.key} removeProductItem={handleDeletedProductInvoice} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ height: "100px" }} />
                                        </TableRow>
                                        <>
                                            <TableRow>
                                                <TableCell rowSpan={3} colSpan={2} />
                                                <TableCell colSpan={2}>Tổng tiền</TableCell>
                                                <TableCell align="right">{`${fNumber(totalPriceInvoice(invoiceList))} VNĐ`}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2}>Số lượng</TableCell>
                                                <TableCell align="right">{totalQuantityInvoice(invoiceList)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2}>Thanh toán</TableCell>
                                                <TableCell align="right">{`${fNumber(totalPriceInvoice(invoiceList))} VNĐ`}</TableCell>
                                            </TableRow>
                                        </>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Stack justifyContent={"center"} alignItems={"center"} mt={3}>
                                <Button
                                    startIcon={<Iconify icon={"carbon:add-alt"} />}
                                    variant="contained"
                                    size={"large"}
                                    sx={{ width: "200px" }}
                                    onClick={handleOrder}
                                >
                                    Đặt hàng
                                </Button>
                            </Stack>
                        </Stack>
                    )}
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
            <Modal open={open} onClose={() => setOpen(!open)} disableAutoFocus disableRestoreFocus disableEnforceFocus disableEscapeKeyDown>
                <Box sx={style}>
                    <Typography variant="body1" component={"h1"} fontSize={"20px"} lineHeight={"30px"} fontWeight={600}>
                        Nhà cung cấp
                    </Typography>

                    {SUPPLIER_LIST.length > 0 &&
                        SUPPLIER_LIST.map((item, index) => (
                            <PopupInfo key={index} name={item.name} address={item.address} phone={item.phone} selectItem={handleSelectSupplier} />
                        ))}
                    {SUPPLIER_LIST.length < 0 && <Typography variant="h1">Không có dữ liệu</Typography>}
                </Box>
            </Modal>
        </Fragment>
    );
}

export default Order;
