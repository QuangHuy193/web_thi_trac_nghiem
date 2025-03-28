import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import UserPage from "../pages/User/UserPage";

const publicRoutes = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/login",
    page: Login,
  },
];

const privateRoutes = [
  {
    path: "/user",
    page: UserPage,
  },
];

export { publicRoutes, privateRoutes };
