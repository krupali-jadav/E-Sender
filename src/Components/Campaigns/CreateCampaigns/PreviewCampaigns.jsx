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

const PreviewCampaign = ({ campaignData, setCurrent }) => {
  const [loading, setLoading] = useState(false);

  const [scheduleType, setScheduleType] = useState("now");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card>
                  <Space direction="vertical" size="large">
                    <Text>{t("campaign.name", { defaultValue: "Campaign Name" })}:<Text strong> {campaignData?.domain || "-"}</Text></Text>
                    <Text>{t("selected.template", { defaultValue: "Selected Template" })}: <Text strong>{campaignData?.template?.name || "-"}</Text></Text>
                    <Text>{t("total.contacts", { defaultValue: "Total Contacts" })}: <Text strong>{campaignData?.contacts?.length || 0}</Text></Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={t("send.test.email", { defaultValue: "Send Test Email Message" })}>
                  <Text>{t("email", { defaultValue: "Email" })}</Text>

                  <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginTop: 10 }}>
                    <Col xs={24} sm={24} md={26} lg={24} xl={16} xxl={18} >
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
                <Card title={t("domain", { defaultValue: "Domain" })}>
                  <Text>domain://{campaignData?.domain || "-"}</Text>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Schedule Your Campaign">
                  <Radio.Group
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Radio value="now">
                        {t("send.it.now", { defaultValue: "Send It Now" })}
                      </Radio>

                      <div>
                        <Radio value="schedule">
                          {t("schedule.it.for.a.specific.time", {
                            defaultValue: "Schedule It For A Specific Time",
                          })}
                        </Radio>

                        {scheduleType === "schedule" && (
                          <div
                            style={{ marginTop: 8, marginLeft: 24, }}
                          >
                            <DatePicker
                              showTime={{ use12Hours: true, format: "hh:mm A" }}
                              format="DD-MM-YYYY hh:mm A"
                              placeholder="Select Date & Time"
                              style={{ width: 250 }}
                            />
                          </div>
                        )}
                      </div>
                    </Space>
                  </Radio.Group>
                </Card>
              </Col>
            </Row>


          </Card>
          <Flex justify="end" gap="small" style={{ marginTop: 8 }}>
            <Button onClick={() => setCurrent(2)}>{t("previous", { defaultValue: "Previous" })}</Button>
            <Button type="primary" loading={loading}>{t("send.now", { defaultValue: "Send Now" })}</Button>
          </Flex>
        </Col>


        {/* Phone Preview */}
        <Col xs={24} lg={6}>
          <PhonePreview
            domainName={campaignData?.domain}
            template={campaignData?.template} />
        </Col>
      </Row>
    </>

  );
};

export default PreviewCampaign;