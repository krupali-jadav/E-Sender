import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, message, Row, Space, Spin } from "antd";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTemplate, getTemplateById, updateTemplate } from "./TemplatesApi";
import { useDispatch, useSelector } from "react-redux";
import Package from "esender-email-editor";
import axiosInstance from "../../util/axiosInstance";
import CreateProjectModal from "./CreateProject";
import SwitchProjectModal from "./SwichProjectModel";

function CreateTemplates() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const template = location.state?.template;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const selectedProject = useSelector((state) => state.app.selectedProject);
    const [templateData, setTemplateData] = useState(null);
    const { templateId } = useParams();
    const [projects, setProjects] = useState([]);
    const [editProject, setEditProject] = useState(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [editorLoading, setEditorLoading] = useState(!!templateId);
    const [open, setOpen] = useState(false);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const data = await getTemplateById(templateId);

            console.log("Template API Response", data);
            if (data?.success) {
                setTemplateData(data.json);
            } else {
                setEditorLoading(false);
            }
        } catch (error) {
            console.log(error);
            setEditorLoading(false);
        } finally {
            setLoading(false);
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
                // if (!selectedProject && projectList.length > 0) {
                //     dispatch(setSelectedProject(projectList[0]));
                // }
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

                editorRef.current?.loadJson(design);
            } catch (err) {
                console.log(err);
            } finally {
                setEditorLoading(false)
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
                    editProject={editProject}
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
                                            loading={loading}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            {templateId
                                                ? t("edit", { defaultValue: "Save" })
                                                : t("create", { defaultValue: "Create" })}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card style={{ minHeight: 600, position: "relative" }}>
                        <Spin spinning={editorLoading}>
                            <Package
                                ref={editorRef}
                                apiKey="eed_live_9a24888b38c2ac94f5f55a37ff190d8752e2ced121449e7c"
                            />
                        </Spin>
                    </Card>
                </Space>
                <SwitchProjectModal
                    open={projectModalOpen}
                    onCancel={() => setProjectModalOpen(false)}
                    projects={projects}
                    selectedProject={selectedProject}
                    // onProjectSelect={() => {
                        
                    // }}
                    onCreateProject={() => {
                        setEditProject(null);
                        setOpen(true);
                    }}
                    onEditProject={(project) => {
                        setEditProject(project);
                        setOpen(true);
                    }}
                />
            </PageContainer>
        </>
    );
}

export default CreateTemplates;