import { useEffect, useState } from "react";
// material
import { Container, Stack, Typography } from "@mui/material";
// components
import Page from "../components/Page";
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from "../sections/@dashboard/products";
import productApi from "src/api/productApi";
import Loading from "src/components/Loading";
// mock

// ----------------------------------------------------------------------

export default function EcommerceShop() {
    const [loading, setLoading] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [productList, setProductList] = useState([]);

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const res = await productApi.getAll();

            if (res.success) {
                setProductList(res.products);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProductList();
    }, []);
    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    return (
        <Page title="Dashboard: Products">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Sản phẩm
                </Typography>

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                        <ProductFilterSidebar isOpenFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />
                        <ProductSort />
                    </Stack>
                </Stack>
                {loading ? <Loading /> : <ProductList products={productList} />}
                <ProductCartWidget />
            </Container>
        </Page>
    );
}
