import { useState } from "react";
import {
    Button,
    Paper,
    Stack,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Modal,
    Box,
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "src/components/Iconify";
import { fDate } from "src/utils/formatTime";

import categoryApi from "src/api/categoryApi";
import ModalCreate from "./Create";
import { loadCategory } from "src/redux/actions";
import EditCategory from "./Edit";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    border: "1px solid #ccc",
    boxShadow: 24,
    p: 4,
};

function Category() {
    const dispatch = useDispatch();
    const categoryList = useSelector((state) => state.data.categoryList);
    const [loading, setLoading] = useState(false);
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [dataCategorySelected, setDataCategorySelected] = useState({});
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });
    const handleClose = () => {
        setVisibleCreate(false);
        setVisibleEdit(false);
        setVisibleDelete(false);
    };

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getAll();

            if (res.success) {
                console.log(res.categories);
                dispatch(loadCategory(res.categories));
            }
        } catch (error) {}
        setLoading(false);
    };

    const handleCreate = async (data) => {
        setLoading(true);
        try {
            const res = await categoryApi.create(data);

            if (res.success) {
                setToastMessage({
                    open: true,
                    type: "success",
                    message: "Tạo mới thành công",
                });
                fetchCategory();
                setVisibleCreate(false);
            }
        } catch (error) {}
        setLoading(false);
    };

    const handleEdit = async (data) => {
        setLoading(true);
        try {
            const res = await categoryApi.update(data.id, { name: data.name, description: data.description });

            if (res.success) {
                setToastMessage({ open: true, type: "success", message: "Chỉnh sửa thành công" });
                fetchCategory();
                setVisibleEdit(false);
            }
        } catch (error) {
            setToastMessage({ open: true, type: "error", message: "Chỉnh sửa thất bại" });
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await categoryApi.destroy(id);

            if (res.success) {
                setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
                fetchCategory();
                setVisibleDelete(false);
            }
        } catch (error) {
            setToastMessage({ open: true, type: "error", message: "Xóa thất bại" });
        }
        setLoading(false);
    };

    return (
        <>
            <Typography variant={"subtitle1"} fontSize={24} lineHeight={"39px"}>
                Danh mục
            </Typography>
            <Paper elevation={2}>
                <Stack spacing={2}>
                    <Button onClick={() => setVisibleCreate(true)} variant={"outlined"} startIcon={<Iconify icon={"material-symbols:add"} />}>
                        Thêm
                    </Button>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên danh mục</TableCell>
                                    <TableCell />
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell />
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell align="right">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryList &&
                                    categoryList?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell colSpan={2}>{item.name}</TableCell>
                                            <TableCell colSpan={2}>{item.description || "Chưa có mô tả"}</TableCell>
                                            <TableCell>{fDate(item.createdAt || new Date())}</TableCell>
                                            <TableCell align={"center"}>
                                                <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-end"} spacing={2}>
                                                    <Button
                                                        variant={"text"}
                                                        onClick={() => {
                                                            setDataCategorySelected(item);
                                                            setVisibleEdit(true);
                                                        }}
                                                    >
                                                        Chỉnh sửa
                                                    </Button>
                                                    <Divider orientation="vertical" flexItem />
                                                    <Button
                                                        variant={"text"}
                                                        color={"error"}
                                                        onClick={() => {
                                                            setDataCategorySelected(item);
                                                            setVisibleDelete(true);
                                                        }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Paper>
            <Modal open={visibleCreate} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>Tạo danh mục sản phẩm</Typography>

                    <Box>
                        <ModalCreate submit={handleCreate} loading={loading} />
                    </Box>
                </Box>
            </Modal>
            <Modal open={visibleEdit} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>Chỉnh sửa danh mục</Typography>

                    <Box>
                        <EditCategory category={dataCategorySelected} submit={handleEdit} loading={loading} />
                    </Box>
                </Box>
            </Modal>
            <Modal open={visibleDelete} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>Xóa danh mục</Typography>
                    <Typography variant="body2">Bạn có chắc xóa danh mục này không?</Typography>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-end"} spacing={2} mt={4}>
                        <Button color={"primary"} variant="contained" onClick={() => setVisibleDelete(false)}>
                            Hủy
                        </Button>
                        <Button color={"error"} variant="contained" onClick={() => handleDelete(dataCategorySelected._id)}>
                            Xóa
                        </Button>
                    </Stack>
                </Box>
            </Modal>
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

export default Category;
