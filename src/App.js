import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/routes";
import PrivateRoute from "./Utils/PrivateRoute";
import ToastNotification from "./Utils/ToastNotification";

function App() {
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
