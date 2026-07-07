import { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Flex,
    List,
    Card,
    Typography,
    Empty,
    message,
} from "antd";
import { createProject, getProjects } from "./TemplatesApi";
import { t } from "i18next";

const { Text } = Typography;

const CreateProjectModal = ({ open, onCancel, refreshProjects, editProject }) => {
    const [form] = Form.useForm();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            if (data?.success) {
                setProjects(data?.projects || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchProjects();
        }
    }, [open]);

    const handleSave = async (values) => {
        try {
            setLoading(true);
            const data = await createProject({
                name: values.projectName,
            });
            if (data?.success) {
                message.success("Project created successfully");
                form.resetFields();
                await fetchProjects();
                await refreshProjects();
                onCancel();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={editProject ? t("edit.project", { defaultValue: "Edit Project" }) : t("create.project", { defaultValue: "Create Project" })}
            centered
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item
                    label={t("project.name", { defaultValue: "Project Name" })}
                    name="projectName"
                    rules={[
                        {
                            required: true,
                            message: t("please.enter.project.name", { defaultValue: "Please enter project name" }),
                        },
                    ]}
                >
                    <Input placeholder={t("enter.project.name", { defaultValue: "Enter project name" })} />
                </Form.Item>

                <Flex justify="end" gap={8}>
                    <Button onClick={onCancel}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {editProject ? t("save.project", { defaultValue: "Save Project" }) : t("create.project", { defaultValue: "Create Project" })}
                    </Button>
                </Flex>
            </Form>

            <div style={{
                marginTop: 24,
                maxHeight: "250px",
                overflowY: "scroll",
            }}>
                <Text strong>{t("projects", { defaultValue: "Projects" })}</Text>
                {projects.length > 0 ? (
                    <List
                        style={{ marginTop: 12 }}
                        loading={loading}
                        dataSource={projects}
                        renderItem={(item, index) => (
                            <List.Item>
                                <Card
                                    size="small"
                                    style={{
                                        width: "100%",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Flex justify="space-between">
                                        <div>
                                            <Text strong>{item.name}</Text>
                                            <br />
                                            <Text type="secondary">
                                                Project ID : {item.projectId || item._id}
                                            </Text>
                                        </div>

                                        <Text type="secondary">
                                            #{index + 1}
                                        </Text>
                                    </Flex>
                                </Card>
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No Project Created"
                        style={{ marginTop: 20 }}
                    />
                )}
            </div>
        </Modal>
    );
};

export default CreateProjectModal;