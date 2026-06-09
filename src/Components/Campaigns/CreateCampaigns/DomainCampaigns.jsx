import { Card, Form, Input } from "antd"
import { t } from "i18next"

function DomainCampaigns() {
  return (
    <Card>
      <Form layout="vertical">
        <Form.Item label={t("campaigns_name", { defaultValue: "Campaigns Name" })}
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter Campaigns Name",
            },
          ]}>
            <Input placeholder={t("enter_name", { defaultValue: "Enter Campaigns Name" })} />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default DomainCampaigns
