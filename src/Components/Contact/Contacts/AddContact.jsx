import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Space, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "antd-phone-input";


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
                    {/* {t("cancel", { defaultValue: "Cancel" })} */}
                    Cancel
                </Button>,
                <Button key="add" type="primary">
                    {/* {t("add", { defaultValue: "Add" })} */}
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
                            <Input 
                            // placeholder={t("name", { defaultValue: "Enter Name", })}
                            placeholder="Enter name" />
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
                            <Input
                                // placeholder={t("email", { defaultValue: "Enter Email", })}
                                placeholder="Enter Email" />
                        </Form.Item>

                        <Form.Item
                            label="Custom Fields"
                            name="Custom Fields"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Custom Fields",
                                },
                            ]}
                        >
                            <Input
                                // placeholder={t("custome_fields", { defaultValue: "Enter Custom Fields", })}
                                placeholder="Enter Custom Fields" />
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
                                // placeholder={t("phone_number", {defaultValue: "Enter Phone Number", })}
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
                                                // placeholder={t("group_name", {defaultValue: "Enter Group Name", })}
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
                                                {/* {t("add_group", { defaultValue: "Add Group" })} */}
                                                Add Group
                                            </Button>
                                        </Space.Compact>
                                    </>
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default AddContact;