import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
// sections
import { AppTasks, AppNewsUpdate, AppOrderTimeline, AppWebsiteVisits, AppTrafficBySite, AppWidgetSummary } from "../sections/@dashboard/app";

// ----------------------------------------------------------------------

export default function DashboardApp() {
    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Hi, Welcome back
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Lượng truy cập" total={714000} icon={"ant-design:android-filled"} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Người dùng với" total={1352831} color="info" icon={"ant-design:apple-filled"} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Đơn đặt hàng" total={100000} color="warning" icon={"ant-design:windows-filled"} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Hủy đơn" total={234} color="error" icon={"ant-design:bug-filled"} />
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                        <AppWebsiteVisits
                            title="Lượng truy cập website"
                            subheader="(+43%) than last year"
                            chartLabels={[
                                "01/01/2003",
                                "02/01/2003",
                                "03/01/2003",
                                "04/01/2003",
                                "05/01/2003",
                                "06/01/2003",
                                "07/01/2003",
                                "08/01/2003",
                                "09/01/2003",
                                "10/01/2003",
                                "11/01/2003",
                            ]}
                            chartData={[
                                {
                                    name: "Team A",
                                    type: "column",
                                    fill: "solid",
                                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                },
                                {
                                    name: "Team B",
                                    type: "area",
                                    fill: "gradient",
                                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                                },
                                {
                                    name: "Team C",
                                    type: "line",
                                    fill: "solid",
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppNewsUpdate
                            title="Bài viết mới"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: faker.name.jobTitle(),
                                description: faker.name.jobTitle(),
                                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                                postedAt: faker.date.recent(),
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppOrderTimeline
                            title="Dòng thời gian đặt hàng"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: [
                                    "1983, orders, $4220",
                                    "12 Invoices have been paid",
                                    "Order #37745 from September",
                                    "New order placed #XF-2356",
                                    "New order placed #XF-2346",
                                ][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTrafficBySite
                            title="Truy cập theo trang web"
                            list={[
                                {
                                    name: "FaceBook",
                                    value: 323234,
                                    icon: <Iconify icon={"eva:facebook-fill"} color="#1877F2" width={32} height={32} />,
                                },
                                {
                                    name: "Google",
                                    value: 341212,
                                    icon: <Iconify icon={"eva:google-fill"} color="#DF3E30" width={32} height={32} />,
                                },
                                {
                                    name: "Linkedin",
                                    value: 411213,
                                    icon: <Iconify icon={"eva:linkedin-fill"} color="#006097" width={32} height={32} />,
                                },
                                {
                                    name: "Twitter",
                                    value: 443232,
                                    icon: <Iconify icon={"eva:twitter-fill"} color="#1C9CEA" width={32} height={32} />,
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppTasks
                            title="Công việc"
                            list={[
                                { id: "1", label: "Create FireStone Logo" },
                                {
                                    id: "2",
                                    label: "Add SCSS and JS files if required",
                                },
                                { id: "3", label: "Stakeholder Meeting" },
                                { id: "4", label: "Scoping & Estimations" },
                                { id: "5", label: "Sprint Showcase" },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
