import { CopyOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, message, Space, Typography, } from "antd";
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
      <Text type="secondary" style={{ fontSize: 14 }}>
        Get started
      </Text>

      <Flex
        justify="space-between"
        align="flex-start"
        style={{ marginTop: 12 }}
      >
        <div>
          <Title level={3}>Generate an API Key</Title>
          <Paragraph
            style={{
              marginTop: 12,
              fontSize: 15,
              color: "#8c8c8c",
            }}
          >
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

          <div style={{ marginTop: 40 }}>
            {steps.map((step, index) => (
              <Flex key={index} align="flex-start">
                {/* Timeline */}
                <div
                  style={{
                    width: 60,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: theme ? "#1A1A1A" : "#c9c9c9",
                      color: theme ? "#fff" : "#000",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {index + 1}
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 70,
                        background: "#434343",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  style={{
                    paddingBottom: 35,
                    flex: 1,
                  }}
                >
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {step.title}
                  </Title>

                  <Paragraph
                    style={{
                      color: "#8c8c8c",
                      marginBottom: 0,
                    }}
                  >
                    {step.description}
                  </Paragraph>
                </div>
              </Flex>
            ))}
          </div>
        </div>

        <div>
          <Title level={3}>Use the API key in your code</Title>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c", }} >
            Authenticate your requests by adding your E-Sender API key to your project as an environment variable.
          </Paragraph>

          <Paragraph style={{ fontSize: 15, color: "#8c8c8c", }} >
            Store your API key securely and never expose it in your frontend source code.
          </Paragraph>

          <div style={{ marginTop: 40 }}>
            {codeSteps.map((step, index) => (
              <Flex key={index} align="flex-start">
                {/* Timeline */}
                <div
                  style={{
                    width: 60,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    style={{
                      background: theme ? "#1A1A1A" : "#e7e7e7",
                      color: theme ? "#fff" : "#000",
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  {index !== codeSteps.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 280,
                        background: "#303030",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    paddingLeft: 24,
                    paddingBottom: 30,
                  }}
                >
                  <Title level={4}>{step.title}</Title>

                  {step.description}

                  <div
                    style={{
                      background: "#141414",
                      border: "1px solid #303030",
                      borderRadius: 16,
                      overflow: "hidden",
                      marginTop: 20,
                    }}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #303030",
                      }}
                    >
                      <Text style={{ color: "#BFBFBF" }}>
                        {step.fileName}
                      </Text>

                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(step.code);
                          message.success("Copied!");
                        }}
                      />
                    </Flex>

                    <div
                      style={{
                        padding: 20,
                        background: "#111",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {step.code}
                    </div>
                  </div>
                </div>
              </Flex>
            ))}
          </div>
        </div>
      </Space>
    </div>
  );
}

export default GenerateApiKeyDocs;