import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
import AddDomain from "./Components/Domains/AddDomain";
import Logs from "./Components/Log/Logs";
import Settings from "./Components/Settings/Settings";
import { ConfigProvider, theme as antdTheme } from "antd";
import CreateTemplates from "./Components/Templates/CreateTemplates";
import CreateCampaigns from "./Components/Campaigns/CreateCampaigns/CreateCampaigns";
import WebHook from "./Components/WebHook/WebHook";
import Media from "./Components/Media/Media";
import WebHookDetails from "./Components/WebHook/WebHookDetails";
import ApiRefrennce from "./Components/Documentation/ApiRefrennce";
import Introduction from "./Components/Documentation/Introduction";
import GenerateApiKeyDocs from "./Components/Documentation/GenerateApiKeyDocs";
import AddDomainDocs from "./Components/Documentation/AddDomainDocs";
import DocumentationLayout from "./Components/Documentation/DocumentationLayout ";

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
  const darkMode = useSelector((state) => state?.app?.theme);
  const isAuthenticated = !!token;
  const lang = useSelector((state) => state.app.lang);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/edit-profile", component: EditProfile },
    { path: "/sessions", component: Sessions },
    { path: "/orders", component: Orders },
    { path: "/orders/:order_id", component: Invoice },
    { path: "/templates", component: Templates },
    { path: "/templates/edit-template/:templateId", component: CreateTemplates },
    { path: "/templates/create-template", component: CreateTemplates },
    { path: "/contact/contacts", component: Contacts },
    { path: "/contact/groups", component: Groups },
    { path: "/contact/custom-fields", component: CustomFields },
    { path: "/campaigns", component: Campaigns },
    { path: "/campaigns/create-campaign", component: CreateCampaigns },
    { path: "/domains", component: Domains },
    { path: "/domains/add", component: AddDomain },
    { path: "/logs", component: Logs },
    { path: "/webhooks", component: WebHook },
    { path: "/webhook-details", component: WebHookDetails },
    { path: "/settings", component: Settings },
    { path: "/media", component: Media },
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
    <ConfigProvider
      locale="en"
      theme={{
        algorithm: darkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      }}
    >
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
                      isDocumentationRoute={route.isDocumentationRoute}
                      isAuthenticated={isAuthenticated}
                      props={route.props}
                    />
                  }
                />
              ))}
              <Route
                path="/documentation"
                element={
                  <ProLayouts>
                    <DocumentationLayout />
                  </ProLayouts>
                }
              >
                <Route index element={<Navigate to="introduction" replace />} />
                <Route path="introduction" element={<Introduction />} />
                <Route path="generate-apikey" element={<GenerateApiKeyDocs />} />
                <Route path="adddomain" element={<AddDomainDocs />} />
              </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
          )}
      </Routes>
    </BrowserRouter>
    </ConfigProvider >
  );
}

export default App;