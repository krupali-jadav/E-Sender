import {
  Card,
  Col,
  Row,
  Typography,
  Segmented,
  Progress,
  Space,
  Button,
} from "antd";
import {
  UsergroupAddOutlined,
  AppstoreOutlined,
  NotificationOutlined,
  MailOutlined,
  SendOutlined,
  InboxOutlined,
  DownOutlined,
} from "@ant-design/icons";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;

export default function Dashboard() {
  const stats = [
    {
      title: "TOTAL CONTACTS",
      value: "12,842",
      change: "+12.5%",
      icon: <UsergroupAddOutlined />,
    },
    {
      title: "TEMPLATES",
      value: "452",
      change: "+4.2%",
      icon: <AppstoreOutlined />,
    },
    {
      title: "CAMPAIGNS",
      value: "86",
      change: "0.0%",
      icon: <NotificationOutlined />,
    },
    {
      title: "TOTAL EMAILS",
      value: "1.2M",
      change: "+18.2%",
      icon: <MailOutlined />,
    },
    {
      title: "EMAILS SENT",
      value: "892k",
      change: "+11.3%",
      icon: <SendOutlined />,
    },
    {
      title: "RECEIVED",
      value: "324k",
      change: "-2.1%",
      icon: <InboxOutlined />,
    },
  ];

  const chartData = [
    { day: "Mon", emails: 20, engagement: 50 },
    { day: "Tue", emails: 80, engagement: 100 },
    { day: "Wed", emails: 150, engagement: 260 },
    { day: "Thu", emails: 260, engagement: 320 },
    { day: "Fri", emails: 340, engagement: 380 },
    { day: "Sat", emails: 420, engagement: 390 },
    { day: "Sun", emails: 520, engagement: 460 },
  ];

  const pieData = [
    { name: "Business", value: 30, color: "#1677ff" },
    { name: "Promotions", value: 25, color: "#91caff" },
    { name: "Newsletter", value: 15, color: "#596780" },
    { name: "Spam", value: 10, color: "#93a1b9" },
    { name: "Other", value: 20, color: "#d6e4ff" },
  ];

  return (

    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Dashboard
          </Title>

          <Text type="secondary">
            Real-time performance metrics and email campaign analytics across all connected domains
          </Text>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {stats.map((item) => (
          <Col xs={24} sm={12} md={8} lg={4} key={item.title}>
            <Card
              styles={{
                body: {
                  padding: 16,
                },
              }}
              style={{
                borderRadius: 16,
                height: 120,
              }}
            >
              <Row justify="space-between">
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </Text>

                {item.icon}
              </Row>

              <Title
                level={3}
                style={{
                  margin: "10px 0 4px",
                }}
              >
                {item.value}
              </Title>

              <Text
                style={{
                  color: item.change.includes("-")
                    ? "#ff4d4f"
                    : "#52c41a",
                  fontWeight: 600,
                }}
              >
                {item.change}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Email Volume */}
        <Col xs={24} lg={15}>
          <Card
            style={{
              borderRadius: 16,
              height: "100%",
            }}
            styles={{
              body: {
                padding: 20,
              },
            }}
          >
            <Title level={4} style={{ marginBottom: 0 }}>
              Email Volume
            </Title>

            <Text type="secondary">
              Engagement rate vs. Total email volume over time
            </Text>

            <div
              style={{
                width: "100%",
                height: 250,
                minHeight: 250,
                marginTop: 20,
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="emails"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1677ff"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#1677ff"
                        stopOpacity={0.02}
                      />
                    </linearGradient>

                    <linearGradient
                      id="engagement"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#d9d9d9"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#d9d9d9"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                  />

                  <XAxis dataKey="day" />
                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#c0c4cc"
                    fill="url(#engagement)"
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="emails"
                    stroke="#1677ff"
                    fill="url(#emails)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Campaign Activity */}
        <Col xs={24} lg={9}>
          <Card
            style={{
              borderRadius: 16,
              height: 460,
            }}
          >
            {/* Header */}
            <Row justify="space-between" align="top">
              <Col>
                <Title
                  level={4}
                  style={{
                    marginBottom: 4,
                    fontWeight: 700,
                  }}
                >
                  Campaign Activity
                </Title>

                <Text
                  type="secondary"
                  style={{
                    fontSize: 15,
                  }}
                >
                  Check the campaign activity schedule
                </Text>
              </Col>

              <Col>
                <Button>
                  More details <DownOutlined />
                </Button>
              </Col>
            </Row>

            {/* Timeline */}
            <div
              style={{
                position: "relative",
                marginTop: 40,
                height: 290,
              }}
            >
              {/* Vertical Dotted Lines */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 70,
                  right: 20,
                  bottom: 30,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    style={{
                      borderLeft: "1px dashed #d9d9d9",
                      height: "100%",
                    }}
                  />
                ))}
              </div>

              {/* Days */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 50,
                  color: "#595959",
                  fontSize: 15,
                }}
              >
                <div style={{ height: 60 }}>Sun</div>
                <div style={{ height: 60 }}>Thu</div>
                <div style={{ height: 60 }}>Wed</div>
                <div style={{ height: 60 }}>Tue</div>
                <div style={{ height: 60 }}>Mon</div>
              </div>

              {/* Events */}
              <div
                style={{
                  position: "absolute",
                  left: 70,
                  right: 0,
                  top: 0,
                }}
              >
                {/* Shopee */}
                <div
                  style={{
                    position: "absolute",
                    top: 52,
                    left: "2%",
                    background: "#FFF3CD",
                    borderRadius: 999,
                    padding: "0 16px",
                    height: 38,
                    width: 210,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#B26A00",
                    }}
                  />
                  <span>1212 Shopee selling event</span>
                </div>

                {/* Lazada */}
                <div
                  style={{
                    position: "absolute",
                    top: 112,
                    left: "43%",
                    background: "#E0F2FE",
                    borderRadius: 999,
                    padding: "0 16px",
                    height: 38,
                    width: 245,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#0284C7",
                    }}
                  />
                  <span>Lazada merchant powered event</span>
                </div>

                {/* Tokopedia */}
                <div
                  style={{
                    position: "absolute",
                    top: 172,
                    left: "12%",
                    background: "#FCE7F3",
                    borderRadius: 999,
                    padding: "0 16px",
                    height: 38,
                    width: 180,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#7A1E67",
                    }}
                  />
                  <span>Tokopedia haul event</span>
                </div>

                {/* Bibi */}
                <div
                  style={{
                    position: "absolute",
                    top: 232,
                    left: "55%",
                    background: "#DCFCE7",
                    borderRadius: 999,
                    padding: "0 16px",
                    height: 38,
                    width: 220,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#16A34A",
                    }}
                  />
                  <span>Bibi merchant powered event</span>
                </div>
              </div>

              {/* Time Labels */}
              <Row
                justify="space-between"
                style={{
                  position: "absolute",
                  bottom: -25,
                  left: 70,
                  right: 20,
                }}
              >
                <Text>11:00</Text>
                <Text>13:00</Text>
                <Text>15:00</Text>
                <Text>17:00</Text>
                <Text>19:00</Text>
                <Text>21:00</Text>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>



      {/* Bottom Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Donut */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 20,
              height: "100%",
            }}
          >
            <Title level={4}>
              Email Categories Distribution
            </Title>

            <Text type="secondary">
              Breakdown by semantic categorization
            </Text>

            <Row align="middle">
              <Col span={12}>
                <PieChart width={220} height={220}>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </Col>

              <Col span={12}>
                {pieData.map((item) => (
                  <Row
                    key={item.name}
                    justify="space-between"
                    style={{
                      marginBottom: 14,
                    }}
                  >
                    <Space>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 50,
                          background: item.color,
                        }}
                      />

                      <Text>{item.name}</Text>
                    </Space>

                    <Text strong>{item.value}%</Text>
                  </Row>
                ))}
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Priority */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 20,
              height: "100%",
            }}
          >
            <Title level={4}>
              Email Priority Levels
            </Title>

            <Text type="secondary">
              Current queue distribution by urgency
            </Text>

            <div style={{ marginTop: 30 }}>
              <Text strong>High Priority</Text>
              <Progress percent={80} showInfo={false} />
            </div>

            <div style={{ marginTop: 24 }}>
              <Text strong>Medium Priority</Text>
              <Progress percent={45} showInfo={false} />
            </div>

            <div style={{ marginTop: 24 }}>
              <Text strong>Low Priority</Text>
              <Progress percent={95} showInfo={false} />
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: 40,
              }}
            >
              <a href="/">
                View Full Queue Detail →
              </a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}