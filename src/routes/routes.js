import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";
import Admin from "../pages/Admin/AdminPage";
import AddSubjectPage from "../pages/Admin/AddSubjectPage";
import EditSubjectPage from "../pages/Admin/EditSubjectPage";
import SubSubjectPage from "../pages/Admin/SubSubjectPage";
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
  {
    path: "/admin/subsubject",
    page: SubSubjectPage, 
  },
  {
    path: "/admin/edit-subject/:subject_id",
    page: EditSubjectPage, 
  },

];

const privateRoutes = [
  
];

export { publicRoutes, privateRoutes };
