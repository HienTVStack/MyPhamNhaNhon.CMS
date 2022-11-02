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
import { setCategories, setTags } from "src/redux/actions";

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
    const categoryList = useSelector((state) => state.data.categoryList);
    const tagList = useSelector((state) => state.data.tagList);

    // load category
    const loadCategory = async () => {
        const res = await categoryApi.getAll();
        if (res.message === "OK") {
            dispatch(setCategories(res.categories));
        }
    };
    //load tag
    const loadTag = async () => {
        const res = await tagApi.getAll();
        if (res.message === "OK") {
            dispatch(setTags(res.tags));
        }
    };

    useEffect(() => {
        if (categoryList.length <= 0) {
            loadCategory();
        }
        if (tagList.length <= 0) {
            loadTag();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar
                isOpenSidebar={open}
                onCloseSidebar={() => setOpen(false)}
            />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </RootStyle>
    );
}
