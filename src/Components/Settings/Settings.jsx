import { useState } from "react";
import { Card, Tabs } from "antd";
import { PageContainer } from "@ant-design/pro-components";

import BasicInformation from "./BasicInformation";
import BillingDetails from "./BillingDetails";
import Support from "./Support";
import SocialMedia from "./SocialMedia";
import ApiKey from "./ApiKey";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const tabItems = [
    {
      key: "basic",
      label: "Basic Information",
    },
    {
      key: "billing",
      label: "Billing Details",
    },
    {
      key: "support",
      label: "Support",
    },
    {
      key: "social",
      label: "Social Media",
    },
    {
      key: "api",
      label: "API Key",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicInformation />;

      case "billing":
        return <BillingDetails />;

      case "support":
        return <Support />;

      case "social":
        return <SocialMedia />;

      case "api":
        return <ApiKey />;

      default:
        return <BasicInformation />;
    }
  };

  return (
    <PageContainer >
      <>
        <Tabs
          type="card"
          activeKey={activeTab}
          items={tabItems}
          onChange={(key) => setActiveTab(key)}
          style={{ height: 38 }}
        />

        {renderContent()}
      </>
    </PageContainer>
  );
};

export default Settings;