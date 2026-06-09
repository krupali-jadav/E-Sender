import { PageContainer } from "@ant-design/pro-components";
import {  Steps } from "antd";
import { useState } from "react";

import TemplateCampaigns from "./TemplateCampaigns";
import DomainCampaigns from "./DomainCampaigns";
import ContactCampaigns from "./ContactCampaigns";
import PreviewCampaigns from "./PreviewCampaigns";
function CreateCampaigns() {
  const [current, setCurrent] = useState(0);

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return <DomainCampaigns />;

      case 1:
        return <TemplateCampaigns />;

      case 2:
        return <ContactCampaigns />;

      case 3:
        return <PreviewCampaigns />;

      default:
        return null;
    }
  };

  return (
    <PageContainer title="Create Campaign">
        <Steps
          current={current}
          onChange={setCurrent}
          items={[
            { title: "Domain" },
            { title: "Template" },
            { title: "Contacts" },
            { title: "Preview" },
          ]}
        />

        <div style={{ marginTop: 24 }}>
          {renderStepContent()}
        </div>
    </PageContainer>
  );
}

export default CreateCampaigns;