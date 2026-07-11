import {
  Typography,
  Space,
  List,
  Flex,
  Steps,
  Tag,
} from "antd";
import { useSelector } from "react-redux";


const { Title, Text, Paragraph, Link } = Typography;

const guideItems = [
  {
    title: "Domains Dashboard page",
    href: "#",
  },
  {
    title: "Resend API",
    href: "#",
  },
  {
    title: "Resend CLI command",
    href: "#",
  },
  {
    title: "Resend MCP server",
    href: "#",
  },
];

const stepData = [
  {
    title: "In your Resend Dashboard, navigate to the Domains page.",
  },
  {
    title: "Click the Add Domain button.",
  },
  {
    title: "Enter a domain including a subdomain to use for your Resend emails.",
    description: (
      <>
        <Paragraph style={{ fontSize: 16 }}>
          We strongly recommend sending emails from a subdomain (e.g., notifications.example.com) instead of your root domain (example.com) to conform to deliverability best practices.
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          Choose a subdomain that reflects the purpose of your emails, such as <Tag code>customers.example.com</Tag> or <Tag>updates.example.com</Tag>  .
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          You can have multiple subdomains associated with your root domain. But, each one must be configured and verified individually.
        </Paragraph>
      </>

    ),
    code: "notifications.example.com",
  },
  {
    title: "Choose a region from the list provided",
    description:
      "Select a region to send your emails from. Choose one that is closest to the majority of your recipients.",
    code: "notifications.example.com",
  },
  {
    title: "(optional) Enter a custom subdomain for the Return-Path address if desired.",
    description:
      "Return-Path defaults to send.example.com, although you can provide a custom path.",
    code: "notifications.example.com",
  },
  {
    title: "Update your DNS records with values provided by Resend.",
    description: (
      <>
        <Paragraph style={{ fontSize: 16 }}>
          View the Records tab for your domain to find the records to provide to your DNS host provider. Adding these records will verify that you own the domain and have the correct permissions to send and receive emails.
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          Provide the DKIM and SPF configurations (TXT and MX records) to your DNS provider. These records must match exactly what Resend generated. Copy and paste the records to avoid configuration errors.
        </Paragraph>
      </>

    ),
    code: "notifications.example.com",
  },
  {
    title: "Wait for DNS verification to complete",
    description: (
      <>
        <Paragraph style={{ fontSize: 16 }}>
          When this process is completed correctly, your domain will often verify within 15 minutes of adding the DNS records. However, DNS changes can occasionally take up to 72 hours to propagate globally.
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          You can use Resend's dns.email tool to check that your records are visible publicly. If verification has not completed after 72 hours, use the “Restart verification” button in the Resend dashboard to trigger a fresh verification check.
        </Paragraph>
      </>

    ),
    code: "notifications.example.com",
  },
  {
    title: "Add a DMARC record.",
    description: (
      <>
        <Paragraph style={{ fontSize: 16 }}>
          After your domain is verified, you can then implement DMARC to build additional trust in your domain and protect against email spoofing.
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          This is an email authentication protocol to verify email senders and to allow receivers to reject unauthenticated messages, and is important for email deliverability.
        </Paragraph>
      </>

    ),
    code: "notifications.example.com",
  },
  {
    title: "(optional) Update your domain's Resend configuration options.",
    description: (
      <>
        <Paragraph style={{ fontSize: 16 }}>
          After your domain is verified, you may wish to enable open and click tracking or enforce Transport Layer Security (TLS).
        </Paragraph>

      </>

    ),
    code: "notifications.example.com",
  },
];

const AddDomainDocs = () => {
   const theme = useSelector((state) => state?.app?.theme);
  return (
    <Flex justify="center">
      <div
        style={{
          width: 760,
          padding: "24px 0",
          
        }}
      >
        <Flex justify="space-between" align="start">
          <Space direction="vertical" size={2}>
            <Text type="secondary">Get started</Text>

            <Title level={2} style={{ margin: 0 }}>
              Add a domain
            </Title>
          </Space>

        </Flex>

        <Paragraph
          type="secondary"
          style={{
            fontSize: 16,
            marginTop: 12,
          }}
        >
          Get started sending emails by adding a domain to your account.                  
        </Paragraph>

        <Paragraph type="secondary">
          Resend sends emails using a domain you own. Before you can send or
          receive emails with Resend, you must have a verified domain
          associated with your account.
        </Paragraph>

        <Title level={3} style={{ marginTop: 48 }}>
          Add a domain
        </Title>

        <Paragraph type="secondary">
          You can add and verify a domain you own in four ways:
        </Paragraph>

        <List
          dataSource={guideItems}
          renderItem={(item) => (
            <List.Item
              style={{
                border: "none",
                padding: "6px 0",
              }}
            >
              <Space>
                <Text>•</Text>
                <Text style={{ fontSize: 16 }}>
                  in the
                </Text>

                <Link style={{ fontSize: 16 , color: theme ?"#fff": "#000 ", textDecoration: "underline" }} href={item.href}>
                  {item.title}
                </Link>
              </Space>
            </List.Item>
          )}
        />

        <Paragraph type="secondary" style={{ marginTop: 24, fontSize: 16 }}>
          To add a new domain from the Resend Dashboard:
        </Paragraph>

        <Steps
          direction="vertical"
          current={-1}
          items={stepData.map((step) => ({
            title: (
              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: 16 }}>
                  {step.title}
                </Text>
              </div>
            ),
            description: <Text style={{ fontSize: 16, marginTop: 80 }}>{step.description}</Text>,
          }))}
        />
      </div>
    </Flex>
  );
};

export default AddDomainDocs;