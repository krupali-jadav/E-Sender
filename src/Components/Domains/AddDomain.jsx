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
    Modal,
    Form,
    Flex,
} from "antd";
import { BulbOutlined, PlusOutlined, } from "@ant-design/icons";
import countryList from "../../util/countryList.json";
import { useState } from "react";
import { t } from "i18next";

const { Title, Text } = Typography;

export default function Domain({ onClose, open }) {
    const [form] = Form.useForm();
    const [domainName, setDomainName] = useState("");

    const handleFinish = (values) => {
        setDomainName(values.domain);
    };
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="50%"
            centered
        >
            <Form form={form}
                layout="vertical"
                onFinish={handleFinish}>
                                <Row gutter={[32, 24]}>
                                    <Col xs={24} lg={12}>
                                        <Form.Item>
                                            <Title level={3} style={{ marginBottom: 0 }}>
                                                {t("add_domain", { defaultValue: "Add Domain" })}
                                            </Title>

                                            <Text type="secondary">
                                                {t("add_domain_description", { defaultValue: "Add your domain to start sending emails" })}
                                            </Text>
                                        </Form.Item>

                                        <Form.Item
                                            label={t("domain_name", { defaultValue: "Name" })}
                                            name="domain"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("please_enter_domain_name", { defaultValue: "Please enter domain name" }),
                                                },
                                            ]}
                                        >
                                            <Input size="large" placeholder="example.com" suffix={<BulbOutlined/>} /> 
                                        </Form.Item>

                                        <Form.Item
                                            label={t("country", { defaultValue: "Country" })}
                                            name="country"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select country",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select Country"
                                                options={countryList.map((c) => ({
                                                    value: c.countryCode,
                                                    label: c.countryNameEn,
                                                }))}
                                            />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                shape="round"
                                                icon={<PlusOutlined />}
                                                htmlType="submit"
                                            >
                                                {t("add_domain", { defaultValue: "Add Domain" })}
                                            </Button>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} lg={12} style={{ marginTop: 25}}>
                                        <Card >
                                            <Flex gap={10}>
                                                <Avatar>Y</Avatar>
                                                <div>
                                                    <Text strong>
                                                        {t("your_email", { defaultValue: "Your Email" })}{" "}{` <youremail@${domainName || "domain"}.com>`}
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
                                                paragraph={{
                                                    rows: 3,
                                                }}
                                                style={{
                                                    marginTop: 24,
                                                }}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                          
            </Form>
        </Modal>
    );
}