import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";
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
  {
    path: "/signup",
    page: Signup,
  },
];

const privateRoutes = [
  {
    path: "/user",
    page: UserPage,
  },
];

export { publicRoutes, privateRoutes };
