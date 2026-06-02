import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const ProtectedRoute = ({
  component: Component,
  publicRoute,
  isPolicyRoute,
  props
}) => {

  if (isPolicyRoute) {
    return (
      <PolicyProLayout>
        <Component {...props} />
      </PolicyProLayout>
    )
  }

  if (publicRoute) {
    return <Component {...props} />;
  }
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
    { path: "/contact/contacts", component: Contacts },
    { path: "/contact/groups", component: Groups },
    { path: "/contact/custom-fields", component: CustomFields },
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
        <Route path="/" element={<Login />} />

        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute component={route.component}
              publicRoute={route.publicRoute}
              isPolicyRoute={route.isPolicyRoute}
              props={route.props}
               />
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;