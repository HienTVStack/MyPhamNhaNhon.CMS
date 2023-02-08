import { filter } from "lodash";
// import { sentenceCase } from "change-case";
import { useState } from "react";
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
  Paper,
  Box,
  Divider,
  TableHead,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Link,
  Breadcrumbs,
  InputBase,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// components
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import Iconify from "src/components/Iconify";
import SearchNotFound from "src/components/SearchNotFound";

// mock
import Loading from "src/components/Loading";
import { useEffect } from "react";
import { Fragment } from "react";
import invoiceApi from "src/api/invoiceApi";
import { fNumber } from "src/utils/formatNumber";
import MoreMenuInvoice from "./MoreMenuInvoice";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Khách hàng", alignRight: false },
  { id: "createdAt", label: "Ngày đặt", alignRight: false },
  // { id: "createdAt", label: "Ngày giao hàng", alignRight: false },
  { id: "total", label: "Tổng tiền", alignRight: false },
  { id: "status", label: "Trạng thái", alignRight: false },
  { id: "quantityStock", label: "Sản phẩm" },
  { id: "" },
];

// ----------------------------------------------------------------------

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
    preUrl: "/list",
    title: "Danh sách",
  },
];

const total = (list) => {
  let tmp = 0;
  for (const item of list) {
    tmp += item.total;
  }
  return tmp;
};

const breadcrumbs = preUrls.map((pre, index) => (
  <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
    {pre.title}
  </Link>
));
const COLOR_CREATE_INVOICE = "rgb(54, 179, 126)";
const COLOR_DELIVERY_INVOICE = "rgb(255, 171, 0)";
const COLOR_ERROR_INVOICE = "rgb(255, 86, 48)";

const styleTagStatus = {
  padding: "4px 8px",
  borderRadius: "12px",
  color: "#fff",
  textAlign: "center",
};

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

export default function InvoiceList() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [invoiceList, setInvoiceList] = useState([]);
  const [dateSearch, setDateSearch] = useState(null);
  const [invoiceListSearch, setInvoiceListSearch] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [toastMessage, setToastMessage] = useState({
    open: false,
    type: "error",
    message: "ERR",
  });

  const fetchInvoiceLoaded = async () => {
    setLoading(true);
    try {
      const res = await invoiceApi.getAll();

      if (res.success) {
        setInvoiceList(res.invoices);
        setInvoiceListSearch(res.invoices);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoiceLoaded();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoiceListSearch.length) : 0;

  const filteredUsers = applySortFilter(invoiceListSearch, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const handleSearchByStatus = (e) => {
    const typeInvoice = e.target.value;

    switch (typeInvoice) {
      case "new":
        setInvoiceListSearch(invoiceList.filter((item) => item.status === 0));
        break;
      case "delivery":
        setInvoiceListSearch(invoiceList.filter((item) => item.status === 1));
        break;
      case "error":
        setInvoiceListSearch(invoiceList.filter((item) => item.status === -1));
        break;

      default:
        setInvoiceListSearch(invoiceList);
        break;
    }
  };

  const handleSearchByCreatedAt = (date) => {
    setDateSearch(date);

    const d = new Date(date);

    setInvoiceListSearch(
      invoiceList.filter((item) => {
        const d1 = new Date(item.createdAt);
        return d1.toLocaleDateString("en").toString() === d.toLocaleDateString("en").toString();
      })
    );
  };

  const handleClear = () => {
    setDateSearch(null);
    setSearchText("");
    setInvoiceListSearch(invoiceList);
  };

  const handleSearchText = (e) => {
    const value = e.target.value;

    setSearchText(value);
    if (dateSearch === null) {
      setInvoiceListSearch(
        invoiceList.filter((item) => {
          return item?.auth?.name.toUpperCase().includes(value.toUpperCase());
        })
      );
    } else {
      setInvoiceListSearch(
        invoiceListSearch.filter((item) => {
          return item?.auth?.name.toUpperCase().includes(value.toUpperCase());
        })
      );
    }
  };

  return (
    <Fragment>
      <Page title="Product">
        <Container>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h4">Danh sách hóa đơn</Typography>
            <Breadcrumbs separator=">" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>

          <Paper elevation={1}>
            <Stack direction={"row"} alignItems="center" justifyContent={"space-evenly"} mb={2}>
              <Box elevation={0} sx={{ display: "flex", alignItems: "center", miWidth: "230px", padding: "18px 30px" }}>
                <Iconify icon={"mdi:invoice-check"} sx={{ width: "50px", height: "50px", color: "rgb(0, 184, 217)" }} />
                <Box ml={2}>
                  <Typography variant="body1" fontWeight={700} fontSize={"18px"}>
                    Tổng cộng
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${invoiceList?.length} hóa đơn`}
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${fNumber(total(invoiceList))} đ`}
                  </Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem sx={{ borderStyle: "dashed" }} />
              <Box elevation={0} sx={{ display: "flex", alignItems: "center", miWidth: "230px", padding: "18px 30px" }}>
                <Iconify icon={"mdi:invoice-add"} sx={{ width: "50px", height: "50px", color: COLOR_CREATE_INVOICE }} />
                <Box ml={2}>
                  <Typography variant="body1" fontWeight={700} fontSize={"18px"}>
                    Tạo mới
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${invoiceList?.filter((item) => item.status === 0).length} hóa đơn`}
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${fNumber(total(invoiceList?.filter((item) => item.status === 0)))} đ`}
                  </Typography>
                </Box>
              </Box>{" "}
              <Divider orientation="vertical" variant="middle" flexItem sx={{ borderStyle: "dashed" }} />
              <Box elevation={0} sx={{ display: "flex", alignItems: "center", miWidth: "230px", padding: "18px 30px" }}>
                <Iconify icon={"carbon:delivery"} sx={{ width: "50px", height: "50px", color: COLOR_DELIVERY_INVOICE }} />
                <Box ml={2}>
                  <Typography variant="body1" fontWeight={700} fontSize={"18px"}>
                    Đang giao
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${invoiceList?.filter((item) => item.status === 1).length} hóa đơn`}
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${fNumber(total(invoiceList?.filter((item) => item.status === 1)))} đ`}
                  </Typography>
                </Box>
              </Box>{" "}
              <Divider orientation="vertical" variant="middle" flexItem sx={{ borderStyle: "dashed" }} />
              <Box elevation={0} sx={{ display: "flex", alignItems: "center", miWidth: "230px", padding: "18px 30px" }}>
                <Iconify icon={"mdi:truck-error-outline"} sx={{ width: "50px", height: "50px", color: COLOR_ERROR_INVOICE }} />
                <Box ml={2}>
                  <Typography variant="body1" fontWeight={700} fontSize={"18px"}>
                    Đã hủy
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${invoiceList?.filter((item) => item.status === -1).length} hóa đơn`}
                  </Typography>
                  <Typography variant="body1" fontSize={"14px"}>
                    {`${fNumber(total(invoiceList?.filter((item) => item.status === -1)))} đ`}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
          <Card sx={{ p: 2 }}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
              <Stack direction={"row"} spacing={2} flex={2}>
                <FormControl>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select defaultValue={"all"} label={"Trạng thái"} onChange={handleSearchByStatus} sx={{ minWidth: "200px" }}>
                    <MenuItem value={"all"}>Tất cả ({invoiceList.length})</MenuItem>
                    <MenuItem value={"new"}>Mới tạo ({invoiceList.filter((item) => item.status === 0).length})</MenuItem>
                    <MenuItem value={"delivery"}>Đang giao hàng ({invoiceList.filter((item) => item.status === 1).length})</MenuItem>
                    <MenuItem value={"error"}>Đã hủy ({invoiceList.filter((item) => item.status === -1).length})</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateSearch}
                    label="Ngày khởi tạo"
                    onChange={(newValue) => handleSearchByCreatedAt(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>

              <Stack direction={"row"} minWidth={350} alignItems={"center"} sx={{ border: "1px solid #ccc", borderRadius: "12px" }}>
                <Iconify icon={"ic:baseline-search"} height={24} width={24} sx={{ m: 1 }} />
                <InputBase
                  flex={"1"}
                  fullWidth
                  placeholder={"Tìm tên khách hàng hoặc mã hóa đơn"}
                  sx={{ padding: "10px 12px 10px 0px" }}
                  value={searchText}
                  onChange={handleSearchText}
                />
              </Stack>
              <Button onClick={handleClear}>Clear</Button>
            </Stack>
            {loading ? (
              <Loading />
            ) : (
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        {TABLE_HEAD.map((item, index) => (
                          <TableCell key={index}>{item.label}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                        const { id, auth, deliveryAt, status, products, total, createdAt } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;
                        return (
                          <TableRow hover key={id} tabIndex={-1} selected={isItemSelected} aria-checked={isItemSelected}>
                            <TableCell>{index}</TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Typography variant="subtitle2">{auth?.name}</Typography>
                              <Typography variant="body2">{id}</Typography>
                            </TableCell>
                            <TableCell align="left">
                              {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }).format(new Date(createdAt))}
                            </TableCell>
                            {/* <TableCell>{deliveryAt || ""}</TableCell> */}
                            <TableCell>{`${fNumber(total)} đ`}</TableCell>
                            <TableCell>
                              {status === -1 && (
                                <Box sx={styleTagStatus} backgroundColor={COLOR_ERROR_INVOICE}>
                                  Đã hủy
                                </Box>
                              )}
                              {status === 0 && (
                                <Box sx={styleTagStatus} backgroundColor={COLOR_CREATE_INVOICE}>
                                  Tạo mới
                                </Box>
                              )}
                              {status === 1 && (
                                <Box sx={styleTagStatus} backgroundColor={COLOR_DELIVERY_INVOICE}>
                                  Đang giao
                                </Box>
                              )}
                              {status === 2 && (
                                <Box sx={styleTagStatus} backgroundColor={"primary"}>
                                  Hoàn thành
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>{products?.length}</TableCell>
                            <TableCell align="right">
                              <MoreMenuInvoice id={id} />
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
              count={invoiceList.length}
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
