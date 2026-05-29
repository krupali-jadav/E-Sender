import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ProLayouts from "./Components/ProLayouts";
import EditProfile from "./Components/Profile/Profile";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;