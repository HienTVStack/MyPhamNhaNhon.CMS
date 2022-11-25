// @mui
import PropTypes from "prop-types";
import { Box, Link, Card, Button, Divider, CardHeader, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
// utils
import { fDateTime } from "../../../utils/formatTime";
// components
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import { fNumber } from "src/utils/formatNumber";
import Label from "src/components/Label";
import { Link as RouteLink } from "react-router-dom";

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Thời gian đặt hàng</TableCell>
                            <TableCell>Số lượng SP</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <NewsItem key={index} item={item} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Scrollbar>
                {/* <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                    {list.map((news) => (
                        <NewsItem key={news.id} news={news} />
                    ))}
                </Stack> */}
            </Scrollbar>

            <Divider />

            <Box sx={{ p: 2, textAlign: "right" }}>
                <Button
                    size="small"
                    component={RouteLink}
                    to={"/dashboard/invoice/list"}
                    color="inherit"
                    endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                >
                    Xem tất cả
                </Button>
            </Box>
        </Card>
    );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
    news: PropTypes.shape({
        description: PropTypes.string,
        image: PropTypes.string,
        postedAt: PropTypes.instanceOf(Date),
        title: PropTypes.string,
    }),
};

function NewsItem({ item }) {
    const { id, sumProduct, total, status, createdAt } = item;

    return (
        <TableRow>
            <TableCell>{id}</TableCell>
            <TableCell>{fDateTime(createdAt)}</TableCell>
            <TableCell>{sumProduct}</TableCell>
            <TableCell>{fNumber(total)}</TableCell>
            <TableCell>
                <Label color={"success"}>{status === 0 && "New"}</Label>
            </TableCell>
            <TableCell>More</TableCell>
        </TableRow>
    );
}
