import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { t } from "i18next";
import { useLocation } from "react-router-dom";

function CreateTemplates() {
    const location = useLocation();
    const template = location.state?.template;
    return (
        <PageContainer title="Create Template">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card styles={{ body: { padding: "8px 12px", marginBottom: 0 } }}
                >
                    <Form layout="vertical" initialValues={{
                        templateName: template?.name || "",
                        subject: template?.subject || "",
                    }}>
                        <Row gutter={16} align="bottom">
                            <Col flex="1">
                                <Form.Item
                                    label={t("template.name", { defaultValue: "Template Name" })}
                                    name="templateName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter template name",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t("enter.template.name", { defaultValue: "Enter template name" })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col flex="1">
                                <Form.Item
                                    label={t("subject", { defaultValue: "Subject" })}
                                    name="subject"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter subject",
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("enter.subject", { defaultValue: "Enter Subject" })} />
                                </Form.Item>
                            </Col>

                            <Col>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {template
                                            ? t("edit", { defaultValue: "Edit" })
                                            : t("create", { defaultValue: "Create" })}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card style={{ minHeight: 600 }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: template?.body || "",
                        }}
                    />
                    
                </Card>
            </Space>

        </PageContainer>
    );
}

export default CreateTemplates;