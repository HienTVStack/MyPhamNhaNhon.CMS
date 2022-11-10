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
import CreateProduct from "src/pages/Product/CreateProduct";
import DashboardApp from "../pages/DashboardApp";
import ProductList from "src/pages/Product/ProductList";
import ProductEdit from "src/pages/Product/ProductEdit";
import ProductTrash from "src/pages/Product/ProductTrash";
import BlogCreate from "src/pages/Blog/BlogCreate";
import Order from "src/pages/Order";

// ----------------------------------------------------------------------

export default function Router() {
    return useRoutes([
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
                { path: "app", element: <DashboardApp /> },
                { path: "user", element: <User /> },
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
                // { path: "*", element: <Navigate to="/404" /> },
            ],
        },
    ]);
}
