import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { privateRoutes, publicRoutes } from "./routes/routes";
import PrivateRoute from "./Utils/PrivateRoute";
import ToastNotification from "./Utils/ToastNotification";

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === "admin") {
        localStorage.removeItem("user"); // Xóa user khỏi localStorage khi tắt trình duyệt
      }
    };

    // Đăng ký sự kiện
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener khi component bị unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <Router>
        <div className="App">
          <ToastNotification />
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.page;

              return <Route key={index} path={route.path} element={<Page />} />;
            })}

            {privateRoutes.map((route, index) => {
              const Page = route.page;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<PrivateRoute element={<Page />} />}
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
