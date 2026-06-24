import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, List, message, Modal, Row, Space } from "antd";
// import Package from "esender-email-editor";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTemplate, getTemplateById, updateTemplate } from "./TemplatesApi";
import { useSelector } from "react-redux";
import Package from "esender-email-editor";
import { CheckCircleFilled, CopyOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../util/axiosInstance";
import CreateProjectModal from "./CreateProject";

function CreateTemplates() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const location = useLocation();
    const template = location.state?.template;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const selectedProject = useSelector((state) => state.app.selectedProject);
    const [templateData, setTemplateData] = useState(null);
    const { templateId } = useParams();
    const [projects, setProjects] = useState([]);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchTemplate = async () => {
        try {
            const data = await getTemplateById(templateId);

            console.log("Template API Response", data);
            if (data?.success) {
                setTemplateData(data.json);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        console.log("Template ID:", templateId);
        if (templateId) {
            fetchTemplate();
        }
    }, [templateId]);

    const getProjects = async () => {
        try {
            const response = await axiosInstance.get("/api/projects");

            if (response.data?.success) {
                const projectList = response.data.projects || [];

                setProjects(projectList);

                if (!selectedProject && projectList.length > 0) {
                    dispatch(setSelectedProject(projectList[0]));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);
    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const html = editorRef.current?.getHtml();
            const json = editorRef.current?.getJson();

            console.log("HTML:", html);
            console.log("JSON:", json);

            const payload = {
                HTML: html,
                JSON: {
                    templateName: values.templateName,
                    subject: values.subject,
                    design: json,
                },
            };

            let response;

            if (templateId) {
                response = await updateTemplate(
                    templateId,
                    payload
                );
            } else {
                response = await createTemplate({
                    projectId:
                        selectedProject?._id ||
                        selectedProject?.projectId,
                    ...payload,
                });
            }

            if (response?.success) {
                message.success(
                    templateId
                        ? "Template updated successfully"
                        : "Template created successfully"
                );
                navigate("/templates");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!templateData) return;

        form.setFieldsValue({
            templateName: templateData.templateName,
            subject: templateData.subject,
        });
    }, [templateData]);
    useEffect(() => {
        if (!templateData?.design) return;

        setTimeout(() => {
            console.log(editorRef.current);
            try {
                const design =
                    typeof templateData.design === "string"
                        ? JSON.parse(templateData.design)
                        : templateData.design;

                console.log("Design", design);

                editorRef.current?.loadJson(design);
            } catch (err) {
                console.log(err);
            }
        }, 1000);
    }, [templateData]);


    return (
        <>
            <Space style={{ padding: "16px 0px 0px 40px", fontSize: 15 }} size="small">
                <span style={{ fontWeight: "bold" }}>Project:</span>
                <Button
                    type="link"
                    style={{ padding: 0, fontSize: 16 }}
                    onClick={() => setProjectModalOpen(true)}
                >
                    {selectedProject?.name || "Select Project"}
                </Button>
                <span> {">"} Templates</span>
            </Space>
            <PageContainer title="Create Template" extra={
                <CreateProjectModal
                    open={open}
                    onCancel={() => setOpen(false)}
                    refreshProjects={getProjects}
                />
            }>
                <Space direction="vertical" s ize="large" style={{ width: "100%" }}>
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
                                            {templateId
                                                ? t("edit", { defaultValue: "Edit" })
                                                : t("create", { defaultValue: "Create" })}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card style={{ minHeight: 600 }}>


                        <Package
                            ref={editorRef}
                            apiKey="eed_live_9a24888b38c2ac94f5f55a37ff190d8752e2ced121449e7c"
                        // onLicenseError={(err: LicenseError) => console.error(err)}
                        // showUndoRedo
                        />
                    </Card>
                </Space>
                <Modal
                    title={t("Switch.project", { defaultValue: "Switch Project" })}
                    open={projectModalOpen}
                    footer={<Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setOpen(true)}
                        >
                            Create Project
                        </Button>
                    </Col>}
                    onCancel={() => setProjectModalOpen(false)}
                >
                    <List
                        style={{ overflow: "auto", height: 300 }}
                        size="small"
                        dataSource={projects}
                        renderItem={(project) => {
                            const isSelected =
                                (selectedProject?._id || selectedProject?.projectId) ===
                                (project._id || project.projectId);

                            return (
                                <List.Item
                                    style={{
                                        cursor: "pointer",
                                        padding: "12px",
                                        borderRadius: 6,
                                    }}
                                    onClick={() => {
                                        dispatch(setSelectedProject(project));
                                        getProjectTemplates(
                                            project._id || project.projectId
                                        );

                                        setProjectModalOpen(false);
                                    }}
                                    extra={
                                        isSelected && (
                                            <CheckCircleFilled
                                                style={{
                                                    color: "#52c41a",
                                                    fontSize: 18,
                                                }}
                                            />
                                        )
                                    }
                                >
                                    <List.Item.Meta
                                        title={project.name}
                                        description={
                                            <span>
                                                {project._id || project.projectId}

                                                <CopyOutlined
                                                    style={{
                                                        marginLeft: 8,
                                                        cursor: "pointer",
                                                        color: "#1677ff",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        navigator.clipboard.writeText(
                                                            project._id || project.projectId
                                                        );

                                                        message.success("   copied");
                                                    }}
                                                />
                                            </span>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </Modal>
            </PageContainer>
        </>
    );
}

export default CreateTemplates;