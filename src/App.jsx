import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ProLayouts from "./Components/ProLayouts";
import EditProfile from "./Components/Profile/Profile";
import Sessions from "./Components/Sessions/Sessions";

const ProtectedRoute = ({ component: Component }) => {
  return (
    <ProLayouts>
      <Component />
    </ProLayouts>
  );
};

function App() {

  const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/edit-profile", component: EditProfile },
    { path: "/sessions", component: Sessions },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute component={route.component} />
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;