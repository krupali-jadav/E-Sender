import React, { useEffect, useState } from "react";
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

const { Text } = Typography;

const CreateProjectModal = ({ open, onCancel }) => {
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
                fetchProjects();
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
            title="Create New Project"
            centered
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item
                    label="Project Name"
                    name="projectName"
                    rules={[
                        {
                            required: true,
                            message: "Please enter project name",
                        },
                    ]}
                >
                    <Input placeholder="Enter project name" />
                </Form.Item>

                <Flex justify="end" gap={8}>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Save Project
                    </Button>
                </Flex>
            </Form>

            <div style={{
                marginTop: 24,
                maxHeight: "250px",
                overflowY: "scroll",
            }}>
                <Text strong>Projects</Text>
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