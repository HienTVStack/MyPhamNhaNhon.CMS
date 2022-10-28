import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
//
import Blog from "../pages/Blog";
import User from "../pages/User";
import Login from "../pages/Login";
import NotFound from "../pages/Page404";
import Register from "../pages/Register";
import Products from "../pages/Products";
import CreateProduct from "src/pages/Product/CreateProduct";
import DashboardApp from "../pages/DashboardApp";
import ProductList from "src/pages/Product/ProductList";
import ProductEdit from "src/pages/Product/ProductEdit";

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
                    ],
                },
                { path: "blog", element: <Blog /> },
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
