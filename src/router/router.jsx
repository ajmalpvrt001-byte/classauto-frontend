import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/login/Login";
import Layout from "../layout/Layout";
import Signup from "../pages/login/sign up/Signup";
import Home from "../pages/login/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import ParentContacts from "../pages/contact/ParentContacts";
import Marks from "../pages/marks/Marks";
import Attendance from "../pages/attendance/Attendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "marks",
        element: <Marks />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "contact",
        element: <ParentContacts />,
      },
    ],
  },
]);

export default router;