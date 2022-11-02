// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: "Trang chủ",
        path: "/dashboard/app",
        icon: getIcon("eva:pie-chart-2-fill"),
    },
    {
        title: "Sản phẩm",
        path: "/dashboard/products",
        icon: getIcon("eva:shopping-bag-fill"),
        children: [
            {
                title: "Danh sách",
                path: "products/list",
            },
            {
                title: "Tạo mới",
                path: "products/create",
            },
            {
                title: "Chỉnh sửa",
                path: "products/:slug/edit",
            },
            {
                title: "Sản phẩm",
                path: "products/:slug/detail",
            },
            {
                title: "Thùng rác",
                path: "products/trash",
            },
        ],
    },
    {
        title: "Tài khoản",
        path: "/dashboard/user",
        icon: getIcon("eva:people-fill"),
        children: [
            {
                title: "Danh sách",
                path: "/dashboard/user",
            },
            {
                title: "Tạo mới",
                path: "/dashboard/user",
            },
            {
                title: "Cập nhật",
                path: "/dashboard/user",
            },
        ],
    },
    {
        title: "Hóa đơn",
        path: "/dashboard/invoice",
        icon: getIcon("fa-solid:file-invoice"),
        children: [
            {
                title: "Danh sách",
                path: "/dashboard/invoice/list",
            },
            {
                title: "Chi tiết",
                path: "/dashboard/invoice/details",
            },
            {
                title: "Tạo mới",
                path: "/dashboard/invoice/create",
            },
            {
                title: "Cập nhật",
                path: "/dashboard/invoice/edit",
            },
        ],
    },

    {
        title: "Bài viết",
        path: "/dashboard/blog",
        icon: getIcon("eva:file-text-fill"),
        children: [
            {
                title: "Danh sách bài viết",
                path: "/dashboard/blog",
                icon: getIcon("eva:file-text-fill"),
            },
            {
                title: "Tạo mới bài viết",
                path: "/dashboard/blog/create",
                icon: getIcon("eva:file-text-fill"),
            },
        ],
    },
    // {
    //     title: "login",
    //     path: "/login",
    //     icon: getIcon("eva:lock-fill"),
    // },
    // {
    //     title: "register",
    //     path: "/register",
    //     icon: getIcon("eva:person-add-fill"),
    // },
    // {
    //     title: "Not found",
    //     path: "/404",
    //     icon: getIcon("eva:alert-triangle-fill"),
    // },
];

export default navConfig;
