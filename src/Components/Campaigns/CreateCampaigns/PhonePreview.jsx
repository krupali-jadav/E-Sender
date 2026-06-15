import { Avatar, Button, Card, Col, Divider, Flex, Image, Row, Space, Typography } from 'antd'
import { FaWifi } from 'react-icons/fa'
import { GiNetworkBars } from 'react-icons/gi'
import { RiBattery2ChargeFill } from 'react-icons/ri'
import Island from "../../../assets/Island.png"
import Google from "../../../assets/Google.png"
import { DownOutlined, LockOutlined, MoreOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
const { Text, Title } = Typography;
import { LuReply } from "react-icons/lu";
import { LuForward } from "react-icons/lu";
import { useSelector } from 'react-redux'
import { t } from 'i18next'

function PhonePreview() {
  const [open, setOpen] = useState(false);
  const theme = useSelector((state) => state?.app?.theme);
  const domainName = useSelector((state) => state.domain.selectedDomain);
  return (
    <Flex xs={24} lg={8} >
      <Col
        style={{
          width: 300,
          height: 550,
          margin: "0 auto",
          border: "1.5px solid #222",
          borderRadius: 40,
          padding: 6,
          background: theme ? "#333333" : "#ffff",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <Col
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #222",
            borderRadius: 34,
            paddingInline: 0,
            background: theme ? "#333333" : "#ffff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Col
            style={{
              height: 55,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
              fontSize: 16,
              position: "relative",
            }}
          >
            <Col>4:43</Col>

            <Col>
              <Image src={Island} alt="Dynamic Island" style={{ width: 78, height: 26 }} preview={true} />
            </Col>

            <Col><GiNetworkBars /> <FaWifi /> <RiBattery2ChargeFill /></Col>
          </Col>
          <Col style={{ height: "calc(100% - 55px)", display: "flex", flexDirection: "column", }}>
            <Card style={{ borderRadius: 16, }} bodyStyle={{ padding: 10 }}>
              {/* Header */}
              <Space align="start" style={{ width: "100%" }}>
                <Avatar size={32}>G</Avatar>
                <div style={{ flex: 1 }}>
                  <Row>
                    <Text strong>https://{domainName}</Text>
                  </Row>

                  <Flex
                    align="center"
                    style={{ marginTop: 2, gap: 50 }}
                  >
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

                    <Flex align="center" gap={10}>
                      <Button
                        type="link"
                        size="small"
                        style={{ padding: 0 }}
                      >
                        {t("unsubscribe", {
                          defaultValue: "Unsubscribe",
                        })}
                      </Button>

                      <MoreOutlined />
                    </Flex>
                  </Flex>
                </div>
              </Space>

              {open && (
                <Card
                  size="small"
                  style={{
                    position: "absolute",
                    top: 70,
                    left: 10,
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
                      demo123@gmail.com
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
                      Jun 12, 2026, 04:13 AM
                    </Text>
                  </div>


                  <div style={{ marginBottom: 5 }}>
                    <Text type="secondary" style={{ display: "inline-block", width: 40, }}>
                      <LockOutlined />
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                      test123@gmail.com
                    </Text>
                  </div>

                  <div>
                    <Text style={{ display: "inline-block", width: 40, }}></Text>
                    <a href="#">View security details</a>
                  </div>
                </Card>
              )}
              <Card style={{ marginTop: 16, position: "relative", }} bodyStyle={{ padding: 15, }}>
                <Col style={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", gap: 10, }}>
                  <Image src={Google} height={30} width={30} />
                  <Title level={5} >Keep Track  of your Google Account data</Title>
                  <Text></Text>
                </Col>
                <Divider />
                <Col style={{ textAlign: "center", height: 30, }}>
                  <Text>https://example.com</Text>
                </Col>
              </Card>
            </Card>
            <Flex
              justify="center"
              gap={12}
              style={{
                position: "absolute",
                background: theme ? "black" : "#e6e6e6",
                height: 50,
                bottom: 0,
                alignItems: 'center',
                left: 0,
                right: 0,
              }}
            >
              <Button icon={<LuReply />} shape="round">
                Reply
              </Button>

              <Button icon={<LuForward />} shape="round">
                Forward
              </Button>
            </Flex>
          </Col>
        </Col>
      </Col>
    </Flex>
  )
}

export default PhonePreview