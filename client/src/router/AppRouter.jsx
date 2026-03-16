import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Error from "../pages/Error";
import App from "../App";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import HomeDetails from "../pages/HomeDetails";
import AddHome from "../pages/AddHome";
import HostHomes from "../pages/HostHomes";
import EditHome from "../pages/EditHome";
import Favourites from "../pages/Favourites";
import MyBooking from "../pages/MyBooking";
import RoleProtectedRoute from "../context/RoleProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />
      }, 
      {
        path: "home-details/:homeID",
        element: <HomeDetails />,
      },
      {
        element: <RoleProtectedRoute allowedRoles={["guest"]} />,
        children: [


          {
            path: "/fav-home",
            element: <Favourites />,
          },
          {
            path: "/my-bookings",
            element: <MyBooking />,
          },]
      },

      {
        element: <RoleProtectedRoute allowedRoles={["host"]} />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {
            path: "/add-home",
            element: <AddHome />,
          },
          {
            path: "/host-homes",
            element: <HostHomes />,
          },
          {
            path: "/edit-home/:editHomeID",
            element: <EditHome />,
          },
        ]
      }
    ],
  },
]);
export default router;
