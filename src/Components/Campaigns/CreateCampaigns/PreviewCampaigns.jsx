import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { t } from "i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentTime } from "../../../util/commom.utils";
const { Text } = Typography;

const PreviewCampaign = ({ campaignData, setCurrent, domainName }) => {
  const theme = useSelector((state) => state?.app?.theme);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState("now");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} md={12} xl={12}>

          <div
            style={{
              height: 610,
              maxWidth: 800,
              background: theme ? "#333333" : "#ffff",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{
                padding: "16px 20px",
                flexShrink: 0,
              }}
            >
              <Flex align="center" gap={12}>
                <Avatar
                  size={35}
                  style={{
                    background: "#e6e6e6",
                    color: "#666",
                  }}
                >
                  {(campaignData?.domain || "G")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <div>
                  <Text strong>
                    {campaignData?.domain || "-"}
                  </Text>
                  <br />
                  <Row 
                    onClick={() => setOpen(!open)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text type="secondary">to me</Text>

                    {open ? (
                      <UpOutlined style={{ fontSize: 10 }} />
                    ) : (
                      <DownOutlined style={{ fontSize: 10 }} />
                    )}
                  </Row>
                </div>
              </Flex>
              {open && (
                <Card
                  size="small"
                  style={{
                    position: "absolute",
                    top: 70,
                    left: 50,
                    zIndex: 1000,
                    width: 250,
                    backgroundColor: theme ? "#4d4d4d" : "#f7f7f7",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ marginBottom: 5 }}>
                    <Text type="secondary"
                      style={{ display: "inline-block", width: 40, }} >
                      From
                    </Text>

                    <Text style={{ fontSize: 13 }}>
                      {domainName}
                    </Text>
                  </div>

                  <div style={{ marginBottom: 5 }}>
                    <Text type="secondary" style={{ display: "inline-block", width: 40, }}>
                      To
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                      test123@gmail.com
                    </Text>
                  </div>

                  <div style={{ marginBottom: 5 }}>
                    <Text type="secondary" style={{ display: "inline-block", width: 40, }}>
                      Date
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                      {getCurrentTime()}
                    </Text>
                  </div>

                  <div>
                    <Text style={{ display: "inline-block", width: 40, }}></Text>
                    <a href="#">View security details</a>
                  </div>
                </Card>
              )}

              <Button type="link" size="small">
                Unsubscribe
              </Button>
            </Flex>

            <Divider style={{ margin: 0, flexShrink: 0 }} />

            {/* Template */}
            <div
              style={{
                padding: 24,
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {campaignData?.template?.html ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: campaignData.template.html,
                  }}
                />
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  style={{ height: 400 }}
                >
                  <Text type="secondary">
                    No Template Selected
                  </Text>
                </Flex>
              )}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          {/* <Card> */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <Card>
                <Space direction="vertical" size="large">
                  <Text>{t("campaign.name", { defaultValue: "Campaign Name" })}:<Text strong> {campaignData?.domain || "-"}</Text></Text>
                  <Text>{t("selected.template", { defaultValue: "Selected Template" })}: <Text strong>{campaignData?.template?.name || "-"}</Text></Text>
                  <Text>{t("total.contacts", { defaultValue: "Total Contacts" })}: <Text strong>{campaignData?.contacts?.length || 0}</Text></Text>
                  <Text>{t("domain", { defaultValue: "Domain" })}: <Text strong>{campaignData?.domain || "-"}</Text></Text>
                  {/* <Text>domain://</Text> */}
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={24}>
              <Card title={t("send.test.email", { defaultValue: "Send Test Email Message" })}>
                <Text>{t("email", { defaultValue: "Email" })}</Text>

                <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginTop: 10 }}>
                  <Col xs={24} sm={24} md={26} lg={24} xl={16} xxl={20} >
                    <Input placeholder={t("enter.email", { defaultValue: "Enter Email" })} />
                  </Col>
                  <Col>
                    <Button type="primary">{t("send.email", { defaultValue: "Send Email" })}</Button>
                  </Col>
                </Row>
                <div style={{ height: 40 }} />
              </Card>
            </Col>

            <Col xs={24} md={24}>
              <Card title="Schedule Your Campaign">
                <Radio.Group
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio value="now">
                      {t("send.it.now", { defaultValue: "Send It Now" })}
                    </Radio>

                    <Space direction="horizontal" style={{ width: "100%" }} >
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
                    </Space>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
          </Row>

          <Flex justify="end" gap="small" style={{ marginTop: 8 }}>
            <Button onClick={() => setCurrent(2)}>{t("previous", { defaultValue: "Previous" })}</Button>
            <Button type="primary" loading={loading}>{t("send.now", { defaultValue: "Send Now" })}</Button>
          </Flex>
        </Col>
      </Row>
    </>

  );
};

export default PreviewCampaign;