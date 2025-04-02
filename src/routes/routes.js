import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";

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
  
];

export { publicRoutes, privateRoutes };
