import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("users", "./components/user/list_users.tsx"),
    route("create_user", "./components/user/create_user.tsx"),
    route("detail_user/:username", "./components/user/detail_user.tsx"),
    route("products", "./components/product/list_products.tsx"),
    route("create_product", "./components/product/create_product.tsx"),
] satisfies RouteConfig;
