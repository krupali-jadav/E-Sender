import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { t } from "i18next";

const { Text } = Typography;

const CampaignStep = () => {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card>
                  <Space direction="vertical" size="large">
                    <Text strong>{t("campaign_name", { defaultValue: "Campaign Name" })}</Text>
                    <Text strong>{t("selected_template", { defaultValue: "Selected Template" })}</Text>
                    <Text strong>{t("total_contacts", { defaultValue: "Total Contacts" })}: 0</Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={t("send_test_email", { defaultValue: "Send Test Email Message" })}>
                  <Text>{t("email", { defaultValue: "Email" })}</Text>

                  <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginTop: 10 }}>
                    <Col xs={24} sm={24} md={26} lg={24} xl={8} xxl={18} >
                      <Input placeholder={t("enter_email", { defaultValue: "Enter Email" })} />
                    </Col>
                    <Col>
                      <Button type="primary">{t("send_email", { defaultValue: "Send Email" })}</Button>
                    </Col>
                  </Row>
                  <div style={{ height: 40 }} />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={t("instances", { defaultValue: "Instances" })}>
                  <Flex justify="end" align="center" gap="small">
                    <Pagination simple current={1} total={2} pageSize={3} />

                    <Select
                      defaultValue="2"
                      style={{ width: 100 }}
                      options={[
                        { value: "2", label: "2 / page" },
                        { value: "5", label: "5 / page" },
                        { value: "10", label: "10 / page" },
                      ]}
                    />
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Schedule Your Campaign">
                  <Radio.Group defaultValue="now">
                    <Space direction="vertical">
                      <Radio value="now">Send It Now</Radio>
                      <Radio value="schedule">
                        Schedule It For A Specific Time
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Card>
              </Col>
            </Row>

          </Card>
          <Flex justify="end" gap="small" style={{ marginTop: 24 }}>
            <Button>{t("previous", { defaultValue: "Previous" })}</Button>
            <Button type="primary">{t("send_now", { defaultValue: "Send Now" })}</Button>
          </Flex>
        </Col>
      </Row>

      {/* Phone Preview Space */}
      <Col xs={24} lg={8}>
      </Col>
    </>

  );
};

export default CampaignStep;  