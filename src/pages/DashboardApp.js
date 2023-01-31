// @mui
import { Grid, Container, Typography } from "@mui/material";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
// sections
import { AppNewsUpdate, AppOrderTimeline, AppWebsiteVisits, AppTrafficBySite, AppWidgetSummary } from "../sections/@dashboard/app";
import { useEffect, useState } from "react";
import authApi from "src/api/authApi";
import invoiceApi from "src/api/invoiceApi";
import Loading from "src/components/Loading";
import { fDate } from "src/utils/formatTime";
import productApi from "src/api/productApi";

// ----------------------------------------------------------------------
const totalPrice = (list) => {
  let tmp = 0;
  for (const item of list) {
    tmp += Number(item.total);
  }
  return tmp;
};

export default function DashboardApp() {
  const [loading, setLoading] = useState(false);
  const [totalAccess, setTotalAccess] = useState({});
  const [invoiceList, setInvoiceList] = useState([]);
  const [authList, setAuthList] = useState([]);
  const [productList, setProductList] = useState([]);
  const fetch = async () => {
    try {
      setLoading(true);
      const countConnect = authApi.totalAccess();
      const fetchInvoice = invoiceApi.getAll();
      const fetchAuth = authApi.getAll();
      const fetchProduct = productApi.getAll();
      await Promise.all([countConnect, fetchInvoice, fetchAuth, fetchProduct])
        .then((data) => {
          console.log(data[0]);
          if (data[0].success) {
            setTotalAccess({ email: data[0].value[0], google: data[0].value[1], facebook: data[0].value[2] });
          }
          if (data[1].success) {
            setInvoiceList(data[1].invoices);
          }
          if (data[2]) {
            setAuthList(data[2].userList);
          }
          if (data[3]) {
            setProductList(data[3].products);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetch();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tiệm mỹ phẩm nhà Nhơn uy tín
        </Typography>
        {loading ? (
          <Loading />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Sản phẩm" total={productList?.length} icon={"fluent-mdl2:product-list"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Người dùng" total={authList?.length} color="info" icon={"ph:user-list"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Đơn đặt hàng" total={invoiceList?.length} color="warning" icon={"la:file-invoice-dollar"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Tổng thu" total={totalPrice(invoiceList)} color="success" icon={"arcticons:priceconverter"} />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <AppWebsiteVisits
                title="Dòng thời gian đặt hàng"
                subheader=""
                chartLabels={invoiceList.map((item) => {
                  return fDate(item?.createdAt);
                })}
                chartData={[
                  {
                    name: "Tạo mới",
                    // type: "column",
                    type: "line",
                    // fill: "solid",
                    // type: "line",
                    // fill: "solid",
                    data: invoiceList
                      .filter((item) => {
                        return item?.status === 0;
                      })
                      .slice(0, 20)
                      .map((item) => {
                        return item.total;
                      }),
                  },
                  // {
                  //     name: "Đang giao",
                  //     type: "area",
                  //     fill: "gradient",
                  //     data: invoiceList
                  //         .filter((item) => {
                  //             return item?.status === 1;
                  //         })
                  //         .slice(0, 20)
                  //         .map((item) => {
                  //             return item.total;
                  //         }),
                  // },
                  // {
                  //     name: "Đã hủy",
                  //     type: "area",
                  //     fill: "gradient",
                  //     data: invoiceList
                  //         .filter((item) => {
                  //             return item?.status === -1;
                  //         })
                  //         .slice(0, 20)
                  //         .map((item) => {
                  //             return item.total;
                  //         }),
                  // },
                  // {
                  //     name: "Tất cả",
                  //     type: "line",
                  //     fill: "solid",
                  //     data: invoiceList.map((item) => {
                  //         return item.total;
                  //     }),
                  // },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppNewsUpdate
                title="Đơn hàng chưa được giao"
                list={invoiceList
                  .filter((item) => item.status === 0)
                  .slice(0, 6)
                  .map((item, index) => ({
                    id: item.id,
                    sumProduct: item?.products.length,
                    total: item.total,
                    status: item.status,
                    createdAt: item.createdAt,
                  }))}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppOrderTimeline
                title="Người dùng mới"
                list={authList
                  .filter((item) => item.status === true)
                  .slice(0, 6)
                  .map((item, index) => ({
                    id: item._id,
                    title: item.fullName,
                    type: item.status,
                    time: item.createdAt,
                  }))}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <AppTrafficBySite
                title="Truy cập theo trang web"
                list={[
                  {
                    name: "FaceBook",
                    value: totalAccess?.facebook,
                    icon: <Iconify icon={"eva:facebook-fill"} color="#1877F2" width={32} height={32} />,
                  },
                  {
                    name: "Google",
                    value: totalAccess?.google,
                    icon: <Iconify icon={"eva:google-fill"} color="#DF3E30" width={32} height={32} />,
                  },
                  {
                    name: "Tài khoản",
                    value: totalAccess?.email,
                    icon: <Iconify icon={"mdi:register"} color="#006097" width={32} height={32} />,
                  },
                  {
                    name: "Tổng cộng",
                    value: totalAccess?.facebook + totalAccess?.google + totalAccess?.email,
                    icon: <Iconify icon={"mdi:register"} color="#1C9CEA" width={32} height={32} />,
                  },
                ]}
              />
            </Grid>

            {/* <Grid item xs={12} md={6} lg={8}>
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
                        </Grid> */}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
