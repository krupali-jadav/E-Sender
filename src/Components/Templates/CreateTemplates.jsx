import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, message, Row, Space } from "antd";
// import Package from "esender-email-editor";
import { t } from "i18next";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../util/axiosInstance";

function CreateTemplates() {

    const [showEditor] = useState(true);
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");
    const [jsonContent, setJsonContent] = useState({});

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                projectId: values.projectId,
                HTML: htmlContent,          
                JSON: jsonContent,         
            };

            const response = await axiosInstance.post("/api/templates", payload);

            console.log(response.data);
            message.success("Template created successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to create template");
        } finally {
            setLoading(false);
        }
    };

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
                    }}
                        onFinish={handleSubmit}>
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

                    {/* <Package
                        // ref={ref}
                        apiKey="eed_live_9a24888b38c2ac94f5f55a37ff190d8752e2ced121449e7c"
                    // onLicenseError={(err: LicenseError) => console.error(err)}
                    // showUndoRedo
                    /> */}
                </Card>
            </Space>

        </PageContainer>
    );
}

export default CreateTemplates;