import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Empty, Form, Input, Row, Space } from "antd";
import { t } from "i18next";

function CreateTemplates() {
    return (
        <PageContainer title="Create Template">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card styles={{ body: { padding: "8px 12px", marginBottom: 0 } }}
                >
                    <Form layout="vertical">
                        <Row gutter={16} align="bottom">
                            <Col flex="1">
                                <Form.Item
                                    label={t("template_name", { defaultValue: "Template Name" })}
                                    name="templateName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter template name",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t("enter_template_name", { defaultValue: "Enter template name" })}
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
                                    <Input placeholder={t("enter_subject", { defaultValue: "Enter Subject" })} />
                                </Form.Item>
                            </Col>

                            <Col>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {t("create", { defaultValue: "Create" })}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card style={{ height: 650 }}>
                    <Row>
                        <Col span={24}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
                        </Col>
                    </Row>
                </Card>
            </Space>
        </PageContainer>
    );
}

export default CreateTemplates;