import {createBrowserRouter} from "react-router-dom";
import {LoginPage} from "@/pages/Login/Login.page.tsx";
import {RegisterPage} from "@/pages/Register/Register.page.tsx";
import {HomePage} from "@/pages/Home/Home.page.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/",
        element: <HomePage />,
    }
]);

export default router;