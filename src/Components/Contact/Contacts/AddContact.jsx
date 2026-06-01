import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Typography, Space, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "antd-phone-input";

const { Title, Text } = Typography;

function AddContact({ open, onClose }) {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [phone, setPhone] = useState("");

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""}${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };

    const handleAddGroup = () => {
        if (!groupName.trim()) return;

        setGroups([...groups, groupName]);
        setGroupName("");
    };

    return (
        <Modal
            title="Add Contact"
            open={open}
            onCancel={onClose}
            width={800}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="add" type="primary">
                    Add
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "Please enter valid email",
                                },
                            ]}
                        >
                            <Input placeholder="Enter Email" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter phone number",
                                },
                            ]}
                        >
                            <PhoneInput
                                enableSearch
                                country={"in"}
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Enter phone number"
                            />
                        </Form.Item>

                        <Form.Item label="Groups">
                            <Select
                                showSearch
                                placeholder="Select Groups"
                                options={groups.map((group) => ({
                                    label: group,
                                    value: group,
                                }))}
                                popupRender={(menu) => (
                                    <>
                                        {menu}

                                        <Space.Compact block>
                                            <Input
                                                placeholder="Enter Group Name"
                                                value={groupName}
                                                onChange={(e) =>
                                                    setGroupName(e.target.value)
                                                }
                                            />

                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddGroup}
                                            >
                                                Add Group
                                            </Button>
                                        </Space.Compact>
                                    </>
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Title level={5}>Custom Fields</Title>

                <Text type="secondary">
                    {/* Custom Fields Not Found */}
                </Text>
            </Form>
        </Modal>
    );
}

export default AddContact;