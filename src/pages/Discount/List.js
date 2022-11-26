import { Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import TypeHeading from "src/components/TypeHeading";
import discountApi from "src/api/discountApi";
import Loading from "src/components/Loading";
import { fDate } from "src/utils/formatTime";
import { fNumber } from "src/utils/formatNumber";
import { Link } from "react-router-dom";
function DiscountList() {
    const [loading, setLoading] = useState(false);
    const [discounts, setDiscounts] = useState([]);

    const discountsLoaded = async () => {
        try {
            setLoading(true);
            const res = await discountApi.getAll();
            if (res.success) {
                setDiscounts(res.discounts);
                console.log(discounts);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        discountsLoaded();
    }, []);

    return (
        <Fragment>
            <Stack direction={"row"} justifyContent={"space-between"} mb={4}>
                <TypeHeading variant="body1" fontSize={"24px"}>
                    Chương trình khuyến mãi
                </TypeHeading>
                <Button component={Link} to="/dashboard/discount/create" variant="contained" startIcon={<Iconify icon="material-symbols:add" />}>
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
                                    <TableCell>Mã giảm giá</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                    <TableCell>Tỉ lệ giảm</TableCell>
                                    <TableCell>Giảm tối đa</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discounts?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.code}</TableCell>
                                        <TableCell>{fDate(item.createdAt)}</TableCell>
                                        <TableCell>{fDate(item.finishedAt)}</TableCell>
                                        <TableCell>{`${item.discountValue} %`}</TableCell>
                                        <TableCell>{`${fNumber(item.discountValueMax)} đ`}</TableCell>
                                        <TableCell sx={{ color: item.status ? "#A2D9AF" : "warning" }}>
                                            {item.status ? "Đang hoạt động" : "Hết hạn"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Fragment>
    );
}

export default DiscountList;
