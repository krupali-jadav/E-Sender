import { CopyOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, message, Space, Steps, Typography, } from "antd";
import { useSelector } from "react-redux";
const { Title, Text, Paragraph } = Typography;

const steps = [
  {
    title: "Open Settings",
    description:
      "Navigate to the Settings page from the left sidebar.",
  },
  {
    title: "Open Generate API Key",
    description:
      "Click the Generate API Key option available inside Settings.",
  },
  {
    title: "Generate API Key",
    description:
      "Click the Generate API Key button to create a new API key.",
  },
  {
    title: "Copy API Key",
    description:
      "Copy the generated API key and store it securely. This key is required for authenticating API requests.",
  },
  {
    title: "Use API Key",
    description:
      "Use the generated API key in your application, SDK, or API requests to access E-Sender services.",
  },
];

const codeSteps = [
  {
    title: "Create and store an environment variable",
    description: (
      <>
        <Paragraph style={{ color: "#8C8C8C", fontSize: 15 }}>
          Store your API key as an environment variable in your project.
          This keeps your API key secure and prevents it from being
          committed to version control.
        </Paragraph>

        <Paragraph style={{ color: "#8C8C8C", fontSize: 15 }}>
          For example, create a <Text code>.env</Text> file in the root
          of your project and add:
        </Paragraph>
      </>
    ),
    fileName: ".env",
    code: "ESENDER_API_KEY=es_xxxxxxxxxxxxxxxxx",
  },
  {
    title: "Use the environment variable in your code",
    description: (
      <>
        <Paragraph style={{ color: "#8C8C8C", fontSize: 15 }}>
          Load the environment variable and initialize the E-Sender SDK
          using the API key.
        </Paragraph>
      </>
    ),
    fileName: "index.js",
    code: `const resend = new Resend(process.env.RESEND_API_KEY);`,
  },
];

function GenerateApiKeyDocs() {
  const theme = useSelector((state) => state?.app?.theme);
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "48px 32px 80px",
      }}
    >
      <Text type="secondary">
        Get started
      </Text>

      <Flex
        justify="space-between"
        align="flex-start"
      >
        <div>
          <Title level={3}>Generate an API Key</Title>
          <Paragraph style={{ fontSize: 15, color: "#8c8c8c", }}>
            Get started sending emails by generating an API key.
          </Paragraph>
        </div>
      </Flex>

      <Space direction="vertical" size={25} style={{ width: "100%" }}>
        <div>
          <Title level={3}>E-Sender API Keys</Title>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c" }}>
            API keys are secret tokens used to authenticate your requests.They are unique to your account and must be kept confidential.
          </Paragraph>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c" }}>
            You must create at least one API key to use the platform through SDKs, API integrations, or other supported services.
          </Paragraph>
        </div>

        <div>
          <Title level={3}>Generate an API Key</Title>

          <Paragraph style={{ fontSize: 16, color: "#8c8c8c" }}>
            Follow the steps below to generate your API key:
          </Paragraph>
          <Steps
            direction="vertical"
            items={steps.map((step, index) => ({
              title: (
                <Typography.Text
                  strong
                  style={{ color: theme ? "#c9c9c9" : "#1A1A1A", fontSize: 16, }}
                >
                  {step.title}
                </Typography.Text>
              ),
              description: (
                <div style={{ marginBottom: 20 }}>
                  <Typography.Text
                    style={{ color: theme ? "#8c8c8c" : "#1A1A1A", }}
                  >
                    {step.description}
                  </Typography.Text>
                </div>
              ),
              icon: (
                <Avatar
                  size={32}
                  style={{
                    background: theme ? "#1A1A1A" : "#c9c9c9",
                    color: theme ? "#fff" : "#000",
                    fontSize: 14,
                  }}
                >
                  {index + 1}
                </Avatar>
              ),
            }))}
          />
        </div>

        <div>
          <Title level={3}>Use the API key in your code</Title>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c", }} >
            Authenticate your requests by adding your E-Sender API key to your project as an environment variable.
          </Paragraph>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c", }} >
            Store your API key securely and never expose it in your frontend source code.
          </Paragraph>

          <Steps
            direction="vertical"
            items={codeSteps.map((step, index) => ({
              style: { marginBottom: 20, },
              title: (
                <Typography.Text
                  strong
                  style={{ color: theme ? "#c9c9c9" : "#1A1A1A", fontSize: 16, }}
                >

                  {step.title}
                </Typography.Text>
              ),
              description: (
                <>
                  {step.description}

                  <div
                    style={{
                      background: "#141414",
                      border: "1px solid #a3a3a3",
                      borderRadius: 16,
                      overflow: "hidden",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #303030",
                        background: theme ? "#1A1A1A" : "#dddddd",
                        color: theme ? "#fff" : "#000",
                      }}
                    >
                      <Text>
                        {step.fileName}
                      </Text>

                      <Text copyable></Text>
                    </Flex>

                    <div
                      style={{
                        padding: 20,
                        background: theme ? "#1A1A1A" : "#fff",
                        color: theme ? "#fff" : "#000",
                      }}
                    >
                      {step.code}
                    </div>
                  </div>
                </>
              ),
              icon: (
                <Avatar
                  size={32}
                  style={{
                    background: theme ? "#1A1A1A" : "#c9c9c9",
                    color: theme ? "#fff" : "#000",
                    fontSize: 14,
                  }}
                >
                  {index + 1}
                </Avatar>
              ),
            }))}
          />
        </div>
      </Space>
    </div>
  );
}

export default GenerateApiKeyDocs;