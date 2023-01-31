import { filter } from "lodash";
// import { sentenceCase } from "change-case";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
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
  Box,
  Icon,
  Grid,
  IconButton,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import Iconify from "src/components/Iconify";
import SearchNotFound from "src/components/SearchNotFound";
import { UserListHead } from "src/sections/@dashboard/user";
import { ProductListToolbar } from "src/sections/@dashboard/products";
// mock
import productApi from "src/api/productApi";
// import { NumericFormat } from "react-number-format";
import Loading from "src/components/Loading";
import MoreMenuProduct from "./MoreMenuProduct";
import { useEffect } from "react";
import axios from "axios";

// ----------------------------------------------------------------------
const defaultProduct = {
  category_id: 1685,
  name: "Áo thun nam unisex",
  description:
    "ÁO THUN CHO NAM LÀ KIỂU DÁNG CƠ BẢN. TỪ CỔ ĐIỂN CỔ ĐIỂN ĐẾN CÁC PHIÊN BẢN LIÊN TỤC, CHÚNG ĐẾN Ở NHIỀU HÌNH DẠNG VÀ SILHOUETTES. KIỂU DÁNG DÀI, NGẮN NGẮN VÀ SLEEVELESS LÀ TẤT CẢ CÁC LỰA CHỌN TRONG BỘ SƯU TẬP CỦA CHÚNG TÔI. DÙ BẠN ƯU ĐÃI CÁC THIẾT KẾ CÓ DÂY CHUYỀN HOẶC SLOGAN, CÁC MẪU CƠ BẢN HOẶC HOA, MÀU SẮC CỦA BẠN ĐƯỢC BẢO HIỂM.",
  market_price: 100000,
  attributes: {
    bulky: 0,
    origin: "Anh, Việt Nam",
    product_top_features:
      "ÁO THUN CHO NAM LÀ KIỂU DÁNG CƠ BẢN. TỪ CỔ ĐIỂN CỔ ĐIỂN ĐẾN CÁC PHIÊN BẢN LIÊN TỤC, CHÚNG ĐẾN Ở NHIỀU HÌNH DẠNG VÀ SILHOUETTES. KIỂU DÁNG DÀI, NGẮN NGẮN VÀ SLEEVELESS LÀ TẤT CẢ CÁC LỰA CHỌN TRONG BỘ SƯU TẬP CỦA CHÚNG TÔI. DÙ BẠN ƯU ĐÃI CÁC THIẾT KẾ CÓ DÂY CHUYỀN HOẶC SLOGAN, CÁC MẪU CƠ BẢN HOẶC HOA, MÀU SẮC CỦA BẠN ĐƯỢC BẢO HIỂM.",
    brand: "No Brand",
    product_height: 15,
    product_length: 20,
    product_weight_kg: 2,
    product_width: 30,
  },
  image: "https://ecommerce-api.vndigitech.com/upload/product/6462420800_6_1_1-4148.jpg",
  images: ["https://ecommerce-api.vndigitech.com/upload/product/6462420800_6_1_1-4148.jpg"],
  option_attributes: ["size", "color"],
  variants: [
    {
      sku: "abcskjkm4",
      price: 99000,
      inventory_type: "dropship",
      seller_warehouse: "377762",
      warehouse_stocks: [
        {
          warehouseId: 377762,
          qtyAvailable: 3,
        },
      ],
      image: "https://ecommerce-api.vndigitech.com/upload/product/6462420800_6_1_1-4148.jpg",
    },
  ],
  certificate_files: [
    {
      url: "https://i.pinimg.com/236x/16/83/c3/1683c385af85d756f8fab83a93d48063.jpg",
      type: "brand",
    },
  ],
  meta_data: {
    is_auto_turn_on: true,
  },
};

//-----

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "createdAt", label: "Ngày tạo", alignRight: false },
  { id: "status", label: "Trạng thái", alignRight: false },
  { id: "numSold", label: "Đã bán", alignRight: false },
  { id: "quantityStock", label: "Hàng tồn", alignRight: false },
  { id: "sync", label: "Sync Tiki", alignRight: false },
  { id: "" },
];

const preUrls = [
  {
    preUrl: "/",
    title: "Dashboard",
  },
  {
    preUrl: "/products",
    title: "Sản phẩm",
  },
  {
    preUrl: "#",
    title: "Danh sách",
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

const handleTotalQuantityStock = (list) => {
  let total = 0;
  for (const item of list) {
    total += item.quantityStock;
  }
  return total;
};

const BoxReportItem = (props) => {
  const { number, title, icon, background = "linear-gradient(to right, #F0BF4C , #F0BF4C)" } = props;
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ padding: "30px", backgroundImage: background, borderRadius: "12px", minHeight: "120px" }}
    >
      <Stack justifyContent={"space-between"}>
        <Typography variant={"body1"} sx={{ fontSize: 24, lineHeight: "38.76px", color: "#fff" }}>
          {number || 0}
        </Typography>
        <Typography variant={"body1"} sx={{ fontSize: 20, lineHeight: "40.375px", color: "#fff" }}>
          {title || "..."}
        </Typography>
      </Stack>
      <Icon size="large" sx={{ color: "#fff" }}>
        <Iconify size={"large"} icon={icon} />
      </Icon>
    </Stack>
  );
};

export default function ProductList() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productList, setProductList] = useState([]);
  const [toastMessage, setToastMessage] = useState({
    open: false,
    type: "error",
    message: "ERR",
  });

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      if (res.message === "OK") {
        setProductList(res.products);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleRemoveProductItem = async (id) => {
    setLoading(true);
    try {
      const res = await productApi.destroyById(id);
      if (res.message === "OK") {
        setProductList(productList.filter((product) => product.id !== id));
        setLoading(false);
      }
      setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastMessage({ open: true, type: "error", message: "Có lỗi khi xóa sản phẩm" });
    }
  };

  const handleDestroyMultipleProduct = async (idList) => {
    setLoading(true);
    try {
      const res = await productApi.destroyMultiple({ idList });

      if (res.message === "OK") {
        fetchProductList();
      }
      setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastMessage({ open: true, type: "error", message: "Có lỗi khi xóa sản phẩm" });
    }
  };

  const handleSearchByInStock = () => {
    // setProductList(productLi)
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0;

  const filteredUsers = applySortFilter(productList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const handleAsyncWithTikiApp = async () => {
    setToastMessage({ open: true, type: "warning", message: "Chức năng đang được xây dựng" });
  };

  return (
    <>
      <Page title="Product">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Danh sách sản phẩm
              </Typography>
              <Stack spacing={2}>
                <Breadcrumbs separator=">" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
            </Box>
            <Button variant="contained" component={RouterLink} to="/dashboard/products/create" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm mới
            </Button>
          </Stack>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6} sm={6} md={3} lg={3}>
              <BoxReportItem number={productList.length} title={"Sản phẩm"} icon={"fluent-mdl2:product-variant"} />
            </Grid>
            <Grid item xs={6} sm={6} md={3} lg={3}>
              <BoxReportItem
                number={productList.filter((item) => item.inStock === true).length}
                title={"Đang đăng bán"}
                icon={"ci:show"}
                background={"linear-gradient(to right, #F0BF9C ,#FBBE47)"}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3} lg={3}>
              <BoxReportItem
                number={productList.filter((item) => item.inStock === false).length}
                title={"Chưa đăng bán"}
                icon={"pixelarticons:hidden"}
                background={"linear-gradient(to right, #F59794 ,red)"}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={3} lg={3}>
              <BoxReportItem
                number={productList.filter((item) => item.isSyncTiki === true).length}
                title={"Bán tại Tiki"}
                icon={"mdi:shop-plus"}
                background={"linear-gradient(to right, #3683f5 ,#94bfff)"}
              />
            </Grid>
          </Grid>
          <Card>
            <ProductListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              productsSelected={selected}
              destroyMultipleProduct={handleDestroyMultipleProduct}
              selectInStock={handleSearchByInStock}
              productList={productList}
            />
            {loading ? (
              <Loading />
            ) : (
              <Scrollbar>
                <Typography variant={"subtitle1"} sx={{ marginLeft: "12px" }}>
                  Sản phẩm
                </Typography>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={productList.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />

                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, name, createdAt, image, inStock, numSold, type, slug, isSyncTiki = false } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={isItemSelected} aria-checked={isItemSelected}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name} src={image} />
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
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
                              }).format(new Date(createdAt))}
                            </TableCell>
                            <TableCell align="left">
                              <Label variant="ghost" color={handleTotalQuantityStock(type) > 0 && inStock === true ? "success" : "error"}>
                                {handleTotalQuantityStock(type) > 0 && inStock === true ? "Còn hàng" : "Hết hàng"}
                              </Label>
                            </TableCell>
                            <TableCell align="center">{numSold}</TableCell>
                            <TableCell align="center">{handleTotalQuantityStock(type)}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color={isSyncTiki ? "primary" : "secondary"}
                                onClick={
                                  isSyncTiki
                                    ? () => setToastMessage({ open: true, type: "success", message: "Sản phẩm đã được bán tại Tiki" })
                                    : handleAsyncWithTikiApp
                                }
                              >
                                <Iconify icon={isSyncTiki ? "material-symbols:check" : "material-symbols:sync"} />
                              </IconButton>
                            </TableCell>

                            <TableCell align="right">
                              <MoreMenuProduct slug={slug} product={row} removeProductItem={handleRemoveProductItem} />
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
              count={productList.length}
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
    </>
  );
}
