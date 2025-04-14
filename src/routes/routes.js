import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";
import Admin from "../pages/Admin/AdminPage";
import AddSubjectPage from "../pages/Admin/AddSubjectPage";
import EditSubjectPage from "../pages/Admin/EditSubjectPage";
import SubSubjectPage from "../pages/Admin/SubSubjectPage";
import AddSubSubjectPage from "../pages/Admin/AddSubSubjectPage";
import EditSubSubjectPage from "../pages/Admin/EditSubSubjectPage";
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
    path: "/admin/add-subsubject",
    page: AddSubSubjectPage, 
  },
  {
    path: "/admin/subsubject",
    page: SubSubjectPage, 
  },
  {
    path: "/admin/edit-subject/:subject_id",
    page: EditSubjectPage, 
  },
  {
    path: "/admin/edit-subsubject/:subsubject_id",
    page: EditSubSubjectPage, 
  },
];

const privateRoutes = [
  
];

export { publicRoutes, privateRoutes };
