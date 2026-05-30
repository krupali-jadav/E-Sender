import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />}/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute component={Dashboard} />
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute component={EditProfile} />
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute component={Sessions} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;