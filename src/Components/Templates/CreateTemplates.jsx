import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, message, Row, Space } from "antd";
// import Package from "esender-email-editor";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createTemplate } from "./TemplatesApi";
import { useSelector } from "react-redux";
// import Package from "esender-email-editor";

function CreateTemplates() {
    const [form] = Form.useForm();
    const [showEditor] = useState(true);
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");
    const [jsonContent, setJsonContent] = useState({});
    const selectedProject = useSelector((state) => state.app.selectedProject);
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = {
                projectId: selectedProject?._id || selectedProject?.projectId,
                HTML: htmlContent,
                JSON: jsonContent,
            };
            const data = await createTemplate(payload);

            if (data?.success) {
                message.success("Template created successfully");
            }
        } catch (error) {
            console.log(error);
            message.error("Failed to create template");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProject) {
            form.setFieldsValue({
                projectId:
                    selectedProject._id ||
                    selectedProject.projectId,
            });
        }
    }, [selectedProject]);

    const location = useLocation();
    const template = location.state?.template;
    return (
        <>
            <Space style={{ padding: "16px 0px 0px 40px", fontSize: 15 }} size="small">
                <span style={{ fontWeight: "bold" }}>Project:</span>
                <Button
                    type="link"
                    style={{ padding: 0, fontSize: 16 }}
                >
                    {selectedProject?.name || "Select Project"}
                </Button>
                <span> {">"} Templates</span>
            </Space>
            <PageContainer title="Create Template">
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Card styles={{ body: { padding: "8px 12px", marginBottom: 0 } }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                projectId:
                                    selectedProject?._id ||
                                    selectedProject?.projectId,
                            }}
                            onFinish={handleSubmit}
                        >
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
        </>
    );
}

export default CreateTemplates;