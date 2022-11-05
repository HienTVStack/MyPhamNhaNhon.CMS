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
import {
    loadProductTrash as _loadProductTrash,
    loadCategory as _loadCategory,
    loadProduct as _loadProduct,
    loadTag as _loadTag,
    loadProductStart,
} from "src/redux/actions";
import productApi from "src/api/productApi";
import Loading from "src/components/Loading";

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
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const categoryList = useSelector((state) => state.data.categoryList);
    const tagList = useSelector((state) => state.data.tagList);
    const productList = useSelector((state) => state.data.productList);

    // load category
    const loadCategory = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getAll();
            if (res.message === "OK") {
                dispatch(_loadCategory(res.categories));
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    //load tag
    const loadTag = async () => {
        setLoading(true);
        try {
            const res = await tagApi.getAll();
            if (res.message === "OK") {
                dispatch(_loadTag(res.tags));
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const loadProductTrash = async () => {
        setLoading(true);
        try {
            const res = await productApi.getTrash();
            if (res.message === "OK") {
                dispatch(_loadProductTrash(res.products));
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryList.length === 0 || tagList.length === 0 || productList.length === 0 || productList.length === 0) {
            loadCategory();
            // loadProduct();
            // dispatch(loadProduct);
            // loadProductTrash();
            loadTag();
        }

        dispatch(loadProductStart());

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
