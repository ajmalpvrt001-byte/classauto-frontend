import { createBrowserRouter } from "react-router";
import Login from "../pages/login/Login";
import Layout from "../pages/login/layout/Layout";
import Signup from "../pages/login/sign up/Signup";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "Layout",
    element: <Layout />,
  },
  {
    path: "Signup",
    element: <Signup />,
  }
]);
export default router;