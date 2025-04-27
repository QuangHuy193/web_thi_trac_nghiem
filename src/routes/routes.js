import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/LoginPage";
import Signup from "../pages/Signup/SignUpPage";
import Admin from "../pages/Admin/AdminPage";
import AddSubjectPage from "../pages/Admin/AddSubjectPage";
import EditSubjectPage from "../pages/Admin/EditSubjectPage";
import SubSubjectPage from "../pages/Admin/SubSubjectPage";
import AddSubSubjectPage from "../pages/Admin/AddSubSubjectPage";
import EditSubSubjectPage from "../pages/Admin/EditSubSubjectPage";
import CreateTeacherPage from "../pages/Admin/CreateTeacherPage";
import TeacherPage from "../pages/Admin/TeacherPage";
import EditTeacherPage from "../pages/Admin/EditTeacherPage";
import UserPage from "../pages/Admin/UserPage";
import EditUserPage from "../pages/Admin/EditUserPage";
import StatisticsPage from "../pages/Admin/StatisticsPage";
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
  {
    path: "/admin/create-teacher",
    page: CreateTeacherPage,
  },
  {
    path: "/admin/teacher",
    page: TeacherPage,
  },
  {
    path: "/admin/edit-teacher/:user_id",
    page: EditTeacherPage,
  },
  {
    path: "/admin/user-list",
    page: UserPage,
  },
  {
    path: "/admin/edit-user/:user_id",
    page: EditUserPage,
  },
  {
    path: "/admin/chart",
    page: StatisticsPage,
  },
];

export { publicRoutes, privateRoutes };
