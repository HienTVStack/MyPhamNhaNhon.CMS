import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
//
import Blog from "../pages/Blog/BlogList";
import User from "../pages/User";
import Login from "../pages/Login";
import NotFound from "../pages/Page404";
import Register from "../pages/Register";
import Products from "../pages/Products";
import CreateProduct from "src/pages/Product/ProductCreate";
import DashboardApp from "../pages/DashboardApp";
import ProductList from "src/pages/Product/ProductList";
import ProductEdit from "src/pages/Product/ProductEdit";
import ProductTrash from "src/pages/Product/ProductTrash";
import BlogCreate from "src/pages/Blog/BlogCreate";
import Order from "src/pages/Order";
import List from "src/pages/Order/List";
import SaleOrderItem from "src/pages/Order/SaleOrderItem";
import SaleOrderImport from "src/pages/Order/SaleOrderImport";
import DiscountCreate from "src/pages/Discount/Create";
import DiscountList from "src/pages/Discount/List";
import InvoiceList from "src/pages/Invoice/InvoiceList";
import InvoiceViewDetail from "src/pages/Invoice/InvoiceViewDetail";
import InvoiceEdit from "src/pages/Invoice/InvoiceEdit";
import EcommerceShop from "../pages/Products";
import Setting from "src/pages/Setting";
import Category from "src/pages/Category";

// ----------------------------------------------------------------------

export default function Router() {
    return useRoutes([
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
                { path: "app", element: <DashboardApp /> },
                { path: "e-commerce", element: <EcommerceShop /> },
                { path: "user", element: <User /> },
                { path: "categories", element: <Category /> },
                {
                    path: "products",
                    children: [
                        { path: "create", element: <CreateProduct /> },
                        { path: "e-list", element: <Products /> },
                        { path: "list", element: <ProductList /> },
                        { path: ":slug/edit", element: <ProductEdit /> },
                        { path: "order", element: <Order /> },
                        { path: "trash", element: <ProductTrash /> },
                    ],
                },
                {
                    path: "blog",
                    children: [
                        { path: "list", element: <Blog /> },
                        { path: "create", element: <BlogCreate /> },
                    ],
                },
                {
                    path: "discount",
                    children: [
                        { path: "create", element: <DiscountCreate /> },
                        { path: "list", element: <DiscountList /> },
                    ],
                },
                {
                    path: "me",
                    children: [
                        { path: "saleOrder", element: <Order /> },
                        { path: "list", element: <List /> },
                        { path: "saleOrder/:id", element: <SaleOrderItem /> },
                        { path: "import/:id", element: <SaleOrderImport /> },
                    ],
                },
                {
                    path: "invoice",
                    children: [
                        { path: "list", element: <InvoiceList /> },
                        { path: ":id/detail", element: <InvoiceViewDetail /> },
                        { path: ":id/edit", element: <InvoiceEdit /> },
                    ],
                },
                {
                    path: "setting",
                    element: <Setting />,
                },
            ],
        },
        {
            path: "login",
            element: <Login />,
        },
        {
            path: "register",
            element: <Register />,
        },

        {
            path: "/",
            element: <LogoOnlyLayout />,
            children: [
                { path: "/", element: <Navigate to="/dashboard/app" /> },
                { path: "404", element: <NotFound /> },
                { path: "*", element: <Navigate to="/404" /> },
            ],
        },
    ]);
}
