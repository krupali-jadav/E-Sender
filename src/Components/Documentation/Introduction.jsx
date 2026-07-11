import {
  Row,
  Col,
  Typography,
  Card,
  Alert,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  SiNodedotjs, SiNextdotjs, SiPhp, SiLaravel, SiPython, SiRuby, SiRubyonrails, SiGo, SiRust, SiElixir, SiOpenjdk, SiDotnet,
} from "react-icons/si";
import { TbTerminal2 } from "react-icons/tb";

const { Title, Text, Paragraph } = Typography;

const Introduction = () => {

  const quickstarts = [
    { title: "Node.js", icon: <SiNodedotjs size={26} /> },
    { title: "Next.js", icon: <SiNextdotjs size={26} /> },
    { title: "Express", icon: <span style={{ fontSize: 28 }}>ex</span> },
    { title: "PHP", icon: <SiPhp size={26} /> },
    { title: "Laravel", icon: <SiLaravel size={26} /> },
    { title: "Python", icon: <SiPython size={26} /> },
    { title: "Ruby", icon: <SiRuby size={26} /> },
    { title: "Rails", icon: <SiRubyonrails size={26} /> },
    { title: "Go", icon: <SiGo size={26} /> },
    { title: "Rust", icon: <SiRust size={26} /> },
    { title: "Elixir", icon: <SiElixir size={26} /> },
    { title: "Java", icon: <SiOpenjdk size={26} /> },
    { title: ".NET", icon: <SiDotnet size={26} /> },
    { title: "CLI", icon: <TbTerminal2 size={26} /> },
  ];
  const exploreItems = [
    {
      title: "Emails",
      description: "Visualize all the activity in your account.",
    },
    {
      title: "Domains",
      description: "Ensure deliverability of your emails.",
    },
    {
      title: "Webhooks",
      description: "Notify your application about email events.",
    },
  ];
  return (
    <Row
      gutter={40}
      justify="center"
      style={{
        padding: "40px 2px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Left Content */}
      <Col xs={24} lg={17}>
        <Space
          direction="vertical"
          size={24}
          style={{ width: "100%" }}
        >
          {/* Header */}
          <div>
            <Text type="secondary">Get started</Text>

            <Row justify="space-between" align="middle">
              <Col>
                <Title
                  level={1}
                  style={{
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  Introduction
                </Title>
              </Col>

            </Row>

            <Paragraph
              type="secondary"
              style={{
                fontSize: 15,
                marginTop: 0,
              }}
            >
              E-Sender is the email API for developers Lorem ipsum dolor sit amet consectetur adipisicing elit. A reiciendis sit assumenda quibusdam porro voluptatum..
            </Paragraph>
          </div>

          {/* Alert */}
          <Alert
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            message={
              <span>
                For all documentation in an index, see{" "}
                <a href="#">llms.txt</a>. To view the full
                documentation, see{" "}
                <a href="#">llms-full.txt</a>.
              </span>
            }
          />

          {/* Quickstart */}
          <div id="quickstart">
            <Title level={2}>Quickstart</Title>

            <Paragraph type="secondary">
              Learn how to get E-Sender set up in your
              project.
            </Paragraph>
          </div>

          <div id="explore">
            <Row gutter={[20, 20]}>
              {quickstarts.map((item) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  key={item.title}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                    }}
                  >
                    <div>{item.icon}</div>

                    <div>
                      <Typography.Title
                        level={4}
                        style={{ marginBottom: 4 }}
                      >
                        {item.title}
                      </Typography.Title>

                      <Typography.Text type="secondary">
                        Quickstart
                      </Typography.Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div id="explore" >
            <Typography.Title level={2}>
              Explore
            </Typography.Title>
            

            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: 15 }}
            >
              Discover the full range of features and capabilities.
            </Typography.Paragraph>

            <Row gutter={[20, 20]} >
              {exploreItems.map((item) => (
                <Col xs={24} md={12} lg={6} key={item.title} >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      height: 120,
                    }}
                  >
                    <Typography.Title
                      level={5}
                      style={{ marginBottom: 12 }}
                    >
                      {item.title}
                    </Typography.Title>

                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 14 }}
                    >
                      {item.description}
                    </Typography.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Space>
      </Col>
    </Row>
  );
};

export default Introduction;