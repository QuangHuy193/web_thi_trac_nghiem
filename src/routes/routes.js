import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";
import Admin from "../pages/Admin/AdminPage";
import AddSubjectPage from "../pages/Admin/AddSubjectPage";
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
  {
    path: "/admin",
    page: Admin,
  },
  {
    path: "/admin/add-subject",
    page: AddSubjectPage, 
  },
];

const privateRoutes = [
  
];

export { publicRoutes, privateRoutes };
