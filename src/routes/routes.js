import HomePage from "../pages/Home/HomePage";
import UserPage from "../pages/User/UserPage";

const publicRoutes = [
  {
    path: "/",
    page: HomePage,
  },
];

const privateRoutes = [
  {
    path: "/user",
    page: UserPage,
  },
];

export { publicRoutes, privateRoutes };
