import { PageContainer } from "@ant-design/pro-components";
import { Steps } from "antd";
import {  useState } from "react";

import TemplateCampaigns from "./TemplateCampaigns";
import DomainCampaigns from "./DomainCampaigns";
import ContactCampaigns from "./ContactCampaigns";
import PreviewCampaigns from "./PreviewCampaigns";
function CreateCampaigns() {
  const [current, setCurrent] = useState(0);
  const [campaignData, setCampaignData] = useState({
    domain: null,
    domainKey: null,
    template: null,
    templateKey: null,
    contacts: [],
  });

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <DomainCampaigns
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            setCurrent={setCurrent}
          />
        );

      case 1:
        return (
          <TemplateCampaigns
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            setCurrent={setCurrent}
          />
        );

      case 2:
        return (
          <ContactCampaigns
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            setCurrent={setCurrent}
          />
        );

      case 3:
        return <PreviewCampaigns setCurrent={setCurrent} campaignData={campaignData}  domainName={campaignData?.domain}/>;
    }
  };

  return (
    <PageContainer>
      <Steps
        current={current}
        // onChange={setCurrent} 
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