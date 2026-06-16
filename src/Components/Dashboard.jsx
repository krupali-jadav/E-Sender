import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Progress,
  Space,
} from "antd";
import { Line, Pie } from "@ant-design/charts";
import { PieChartOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { BiBarChart } from "react-icons/bi";

const { Title, Text } = Typography;

const Dashboard = () => {
  const stats = [
     {
      title: "Total Contacts",
      value: 0,
      extra: "+65 increase today",
      color: "#52c41a",
    },
    {
      title: "Total Templates",
      value: 0,
      extra: "+65 increase today",
      color: "#52c41a",
    },
    {
      title: "Total Campaigns",
      value: 0,
      extra: "+65 increase today",
      color: "#52c41a",
    },
    {
      title: "Total Emails",
      value: 0,
      extra: "+12% from last week",
      color: "#52c41a",
    },
    {
      title: "Emails Sent",
      value: 0,
      extra: "82.9% from last week",
      color: "#52c41a",
    },
    {
      title: "Email Received",
      value: 0,
      extra: "+65 increase today",
      color: "#52c41a",
    },
   
    
  ];

  const lineData = [
    { day: "Mon", type: "Emails", value: 25 },
    { day: "Tue", type: "Emails", value: 38 },
    { day: "Wed", type: "Emails", value: 32 },
    { day: "Thu", type: "Emails", value: 15 },
    { day: "Fri", type: "Emails", value: 35 },
    { day: "Sat", type: "Emails", value: 18 },
    { day: "Sun", type: "Emails", value: 20 },

    { day: "Mon", type: "Engagement", value: 22 },
    { day: "Tue", type: "Engagement", value: 40 },
    { day: "Wed", type: "Engagement", value: 30 },
    { day: "Thu", type: "Engagement", value: 12 },
    { day: "Fri", type: "Engagement", value: 38 },
    { day: "Sat", type: "Engagement", value: 15 },
    { day: "Sun", type: "Engagement", value: 22 },
  ];

  const pieData = [
    { type: "Business", value: 445 },
    { type: "Personal", value: 287 },
    { type: "Promotions", value: 190 },
    { type: "Newsletter", value: 95 },
    { type: "Spam", value: 25 },
  ];

  const lineConfig = {
    data: lineData,
    xField: "day",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 320,
    legend: {
      position: "bottom",
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.65,
    height: 250,
    legend: {
      position: "right",
    },
    label: false,
    statistic: {
      title: false,
      content: {
        content: "1042\nEmails",
      },
    },
  };

  return (
    <PageContainer>

      <Text type="secondary">
        Comprehensive overview of email performance and insights
      </Text>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {stats.map((item) => (
          <Col xs={24} sm={12} lg={4} key={item.title}>
            <Card>
              <Statistic title={item.title} value={item.value} />
              <Text style={{ color: item.color }}>{item.extra}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart Section */}
      <Card
        style={{ marginTop: 20 }}
        title={<Space> <BiBarChart />Email Volume</Space>}
        extra={
          <Space>
            <Text>Daily</Text>
            <Text>Weekly</Text>
            <Text>Monthly</Text>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={4}>
            <Statistic title="Open Rate" value="52.1%" />
          </Col>

          <Col span={4}>
            <Statistic title="Click Rate" value="17.8%" />
          </Col>

          <Col span={4}>
            <Statistic title="Reply Rate" value="6.2%" />
          </Col>

          <Col span={4}>
            <Statistic title="Conversion Rate" value="10.2%" />
          </Col>

          <Col span={4}>
            <Statistic title="Bounce Rate" value="0.2%" />
          </Col>
        </Row>

        <Line {...lineConfig} />
      </Card>

      {/* Bottom Section */}
      <Card
        style={{ marginTop: 20 }}
        title={<Space> <PieChartOutlined />Email Categories Distribution </Space>
        }
      >
        <Row gutter={[32, 16]} align="middle">
          <Col xs={24} md={10}>
            <Pie {...pieConfig} />
          </Col>

          <Col xs={24} md={14}>
            <Title level={5}>Email Priority Levels</Title>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Text>High Priority</Text>
                <Text strong>89</Text>
              </div>
              <Progress percent={35} showInfo={false} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Text>Medium Priority</Text>
                <Text strong>156</Text>
              </div>
              <Progress percent={75} showInfo={false} />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Text>Low Priority</Text>
                <Text strong>62</Text>
              </div>
              <Progress percent={30} showInfo={false} />
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;