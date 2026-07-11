import {
    Row,
    Col,
    Card,
    Input,
    Select,
    Button,
    Typography,
    Avatar,
    Skeleton,
    Form,
    Flex,
    Switch,
    Table,
    Steps,
    Space,
} from "antd";
import { PlusOutlined, } from "@ant-design/icons";
import countryList from "../../util/countryList.json";
import { useState } from "react";
import { t } from "i18next";
import { PageContainer } from "@ant-design/pro-components";

const { Title, Text } = Typography;

export default function AddDomain() {
    const [form] = Form.useForm();
    const [domainName, setDomainName] = useState("");
    const [showDnsRecords, setShowDnsRecords] = useState(false);
    const [current, setCurrent] = useState(0);

    const handleFinish = (values) => {
        setDomainName(values.domain);
        setCurrent(1);
        setShowDnsRecords(true);
    };
    const dnsColumns = [
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Content",
            dataIndex: "content",
            ellipsis: true,
        },
        {
            title: "TTL",
            dataIndex: "ttl",
        },
        {
            title: "Priority",
            dataIndex: "priority",
        },
    ];
    const verificationData = [
        {
            key: 1,
            type: "TXT",
            name: "resend._domainkey",
            content: "p=MIGfMA...",
            ttl: "Auto",
            priority: "-",
        },
    ];

    const sendingData = [
        {
            key: 1,
            type: "MX",
            name: "send",
            content: "feedback-smtp.ap-south-1.amazonses.com",
            ttl: "Auto",
            priority: "10",
        },
        {
            key: 2,
            type: "TXT",
            name: "send",
            content: "v=spf1 include:amazonses.com ~all",
            ttl: "Auto",
            priority: "-",
        },
    ];

    const dmarcData = [
        {
            key: 1,
            type: "TXT",
            name: "_dmarc",
            content: "v=DMARC1; p=none;",
            ttl: "Auto",
            priority: "-",
        },
    ];
    return (
        <PageContainer title={t("add.domain", { defaultValue: "Add Domain" })} >
            {!showDnsRecords ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}

                >
                    <Row gutter={[16, 16]} justify="center" >

                        <Col xs={16} lg={10}>
                            <Card>
                                <Space direction="vertical" size="large">
                                    <Col>
                                        <Title level={3} style={{ marginBottom: 0 }}>
                                            Add New Domain
                                        </Title>

                                        <Text type="secondary"  >
                                            Configure your sender identity to start dispatching high-deliverability email campaigns.
                                        </Text>
                                    </Col>
                                    <Col>
                                        <div >
                                            <Title level={5}>
                                                Domain Configuration
                                            </Title>

                                            <Row gutter={6}>
                                                <Col span={20}>
                                                    <Form.Item
                                                        label="Domain Name"
                                                        name="domain"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter domain name",
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder="e.g. mail.company.com"
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={20}>
                                                    <Form.Item
                                                        label="Country"
                                                        name="country"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please select country",
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder="Select a country"
                                                            options={countryList.map((c) => ({
                                                                value: c.countryCode,
                                                                label: c.countryNameEn,
                                                            }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Space>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    icon={<PlusOutlined />}
                                                >
                                                    Add Domain
                                                </Button>

                                                <Button>
                                                    Cancel
                                                </Button>
                                            </Space>
                                        </div>
                                    </Col>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card>
                                <Flex gap={10}>
                                    <Avatar>Y</Avatar>
                                    <div>
                                        <Text strong>
                                            {t("your.email", { defaultValue: "Your Email" })}{" "}{` <youremail@${domainName || "domain"}.com>`}
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            to me
                                        </Text>
                                    </div>
                                </Flex>

                                <Skeleton
                                    active
                                    title={false}
                                    paragraph={{ rows: 5 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <div>
                    <Row gutter={32}>
                        <Col xs={24} md={4}>
                            <Steps
                                direction="vertical"
                                current={1}
                                items={[
                                    {
                                        title: "Domain",
                                    },
                                    {
                                        title: "DNS Records",
                                    },
                                ]}
                            />
                        </Col>

                        <Col xs={24} md={20}>
                            <Space direction="vertical" size="large">
                                <Card >
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Row align="middle" gutter={8}>
                                                <Text  strong style={{ fontSize: 16 }}>
                                                    {domainName}
                                                </Text>
                                            </Row>
                                            <Row align="middle" gutter={8}>
                                            <Text type="secondary">
                                                Status: We're checking your records.
                                            </Text>
                                            </Row>
                                        </Col>

                                        <Col>
                                            <Button type="primary">
                                                Pending Verification
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>

                                {/* DNS Records */}
                                <Card>
                                    <Space direction="vertical" size="large" >
                                    
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Title level={4}>
                                                Fill in your DNS Records
                                            </Title>

                                            <Text type="secondary">
                                                Copy these records into your DNS provider dashboard.
                                            </Text>
                                        </Col>

                                        <Col>
                                            <Space>
                                                <Text>Enable Sending</Text>
                                                <Switch />
                                            </Space>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Title level={5}>DKIM RECORD</Title>

                                        <Table
                                            columns={dnsColumns}
                                            dataSource={verificationData}
                                            pagination={false}
                                        />
                                    </div>
                                    <div>
                                        <Title level={5}>SPF RECORD</Title>

                                        <Table
                                            columns={dnsColumns}
                                            dataSource={sendingData}
                                            pagination={false}
                                        />
                                    </div>
                                    <div>
                                        <Title level={5}>DMARC RECORD</Title>

                                        <Table
                                            columns={dnsColumns}
                                            dataSource={dmarcData}
                                            pagination={false}
                                        />
                                    </div>

                                    <Row
                                        justify="space-between"
                                        align="middle"
                                    >
                                        <Col>
                                            <Text type="secondary">
                                                Records will auto-verify as they propagate.
                                            </Text>
                                        </Col>

                                        <Col>
                                            <Button type="primary">
                                                Verify Now
                                            </Button>
                                        </Col>
                                    </Row>
                                    </Space>
                                </Card>
                            </Space>
                        </Col>
                    </Row>
                </div>
            )}


        </PageContainer>
    );
}