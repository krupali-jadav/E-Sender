import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
} from "antd";
import { t } from "i18next";
import { useState } from "react";
import PhonePreview from "./PhonePreview";

const { Text } = Typography;

const CampaignStep = () => {

  const [scheduleType, setScheduleType] = useState("now");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card>
                  <Space orientation="vertical" size="large">
                    <Text strong>{t("campaign.name", { defaultValue: "Campaign Name" })}</Text>
                    <Text strong>{t("selected.template", { defaultValue: "Selected Template" })}</Text>
                    <Text strong>{t("total.contacts", { defaultValue: "Total Contacts" })}: 0</Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={t("send.test.email", { defaultValue: "Send Test Email Message" })}>
                  <Text>{t("email", { defaultValue: "Email" })}</Text>

                  <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginTop: 10 }}>
                    <Col xs={24} sm={24} md={26} lg={24} xl={8} xxl={18} >
                      <Input placeholder={t("enter.email", { defaultValue: "Enter Email" })} />
                    </Col>
                    <Col>
                      <Button type="primary">{t("send.email", { defaultValue: "Send Email" })}</Button>
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
                  <Radio.Group value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}>
            
                    <Space orientation="vertical">
                      <Radio value="now">{t("send.it.now", { defaultValue: "Send It Now" })}</Radio>
                      <Radio value="schedule">
                        {t("schedule.it.for.a.specific.time", { defaultValue: "Schedule It For A Specific Time" })}
                      </Radio>
                    </Space>
                  </Radio.Group>
                  {scheduleType === "schedule" && (
                    <Space style={{ marginTop: 16 }}>
                      <DatePicker placeholder="Select Date" />
                      <TimePicker placeholder="Select Time" format="HH:mm" />
                    </Space>
                  )}
                </Card>
              </Col>
            </Row>
            

          </Card>
          <Flex justify="end" gap="small" style={{ marginTop: 8 }}>
            <Button>{t("previous", { defaultValue: "Previous" })}</Button>
            <Button type="primary">{t("send.now", { defaultValue: "Send Now" })}</Button>
          </Flex>
        </Col>
      

      {/* Phone Preview Space */}
      <Col xs={24} lg={6}>
      <PhonePreview />
      </Col>
      </Row>
    </>

  );
};

export default CampaignStep;  