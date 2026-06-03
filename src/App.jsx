import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ProLayouts from "./Components/site/ProLayouts";
import EditProfile from "./Components/Profile/Profile";
import Sessions from "./Components/Sessions/Sessions";
import Contacts from "./Components/Contact/Contacts/Contacts";
import Groups from "./Components/Contact/Group/Groups";
import CustomFields from "./Components/Contact/Custom Field/CustomFields";
import PolicyPage from "./Components/PrivacyPolicy/PolicyPage";
import PolicyProLayout from "./Components/PrivacyPolicy/PolicyProLayout";
import Orders from "./Components/Orders/Orders";
import Invoice from "./Components/Orders/Invoice";
import Templates from "./Components/Templates/Templates";
import Campaigns from "./Components/Campaigns/Campaigns";
import Domains from "./Components/Domains/Domains";
import Documentation from "./Components/Documentation/Documentation";
import Logs from "./Components/Log/Logs";
import Settings from "./Components/Settings/Settings";

const ProtectedRoute = ({
  component: Component,
  publicRoute,
  isPolicyRoute,
  isAuthenticated,
  props,
}) => {
  if (!isAuthenticated && !publicRoute) {
    return <Navigate to="/" replace />;
  }

  if (isPolicyRoute) {
    return (
      <PolicyProLayout>
        <Component {...props} />
      </PolicyProLayout>
    );
  }

  if (publicRoute) {
    return <Component {...props} />;
  }

  return (
    <ProLayouts>
      <Component {...props} />
    </ProLayouts>
  );
};

function App() {
  const token = useSelector((state) => state?.user?.token);

  const isAuthenticated = !!token;

  const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/edit-profile", component: EditProfile },
    { path: "/sessions", component: Sessions },
    { path: "/orders", component: Orders },
    { path: "/orders/:order_id", component: Invoice },
    { path: "/templates", component: Templates },
    { path: "/contact/contacts", component: Contacts },
    { path: "/contact/groups", component: Groups },
    { path: "/contact/custom-fields", component: CustomFields },
    { path: "/campaigns", component: Campaigns },
    { path: "/domains", component: Domains },
    { path: "/logs", component: Logs },
    { path: "/settings", component: Settings },
    { path: "/documentation", component: Documentation },
    {
      path: "/privacy-policy",
      component: PolicyPage,
      publicRoute: true,
      isPolicyRoute: true,
      props: { type: "privacyPolicy" },
    },
    {
      path: "/terms-and-conditions",
      component: PolicyPage,
      publicRoute: true,
      isPolicyRoute: true,
      props: { type: "termsAndConditions" },
    },
    {
      path: "/refund-policy",
      component: PolicyPage,
      publicRoute: true,
      isPolicyRoute: true,
      props: { type: "refundPolicy" },
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login />} />

            {routes
              .filter((route) => route.publicRoute)
              .map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute
                      component={route.component}
                      publicRoute={true}
                      isPolicyRoute={route.isPolicyRoute}
                      isAuthenticated={false}
                      props={route.props}
                    />
                  }
                />
              ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {routes.map((route) => (
              <Route 
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute
                    component={route.component}
                    publicRoute={route.publicRoute}
                    isPolicyRoute={route.isPolicyRoute}
                    isAuthenticated={isAuthenticated}
                    props={route.props}
                  />
                }
              />
            ))}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;