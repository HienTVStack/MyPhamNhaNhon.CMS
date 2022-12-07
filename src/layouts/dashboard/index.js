import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
//
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import categoryApi from "src/api/categoryApi";
import tagApi from "src/api/tagApi";
import supplierApi from "src/api/supplierApi";
import { loadCategory as _loadCategory, loadTag as _loadTag, setProduct, setSupplier, setUser } from "src/redux/actions";
import Loading from "src/components/Loading";
import authUtil from "src/utils/authUtil";
import productApi from "src/api/productApi";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
    display: "flex",
    minHeight: "100%",
    overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up("lg")]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const user = useSelector((state) => state.data.user);
    const categoryList = useSelector((state) => state.data.categoryList);
    const tagList = useSelector((state) => state.data.tagList);
    const productList = useSelector((state) => state.data.productList);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([categoryApi.getAll(), tagApi.getAll(), supplierApi.getAll(), productApi.getAll()]).then(
                ([categoryList, tagList, supplierList, productList]) => {
                    if (categoryList.success) {
                        dispatch(_loadCategory(categoryList.categories));
                    }
                    if (tagList.success) {
                        dispatch(_loadTag(tagList.tags));
                    }
                    if (supplierList.success) {
                        console.log(supplierList);
                        dispatch(setSupplier(supplierList.suppliers));
                    }
                    if (productList.success) {
                        dispatch(setProduct(productList.products));
                    }
                }
            );
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authUtil.isAuthenticated();

            if (!user) {
                navigate("/login");
            } else {
                dispatch(setUser(user));
                setLoading(false);
            }
        };
        checkAuth();
        if (categoryList.length === 0 || tagList.length === 0 || productList.length === 0) {
            fetchData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>{loading ? <Loading /> : <Outlet />}</MainStyle>
        </RootStyle>
    );
}
