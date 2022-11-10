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
import { loadCategory as _loadCategory, loadTag as _loadTag, setUser } from "src/redux/actions";
import Loading from "src/components/Loading";
import authUtil from "src/utils/authUtil";
import { util } from "prettier";

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
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
        if (categoryList.length === 0 || tagList.length === 0) {
            loadCategory();
            loadTag();
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
