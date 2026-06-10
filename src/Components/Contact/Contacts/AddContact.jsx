import { useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Space,} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "antd-phone-input";
import { t } from "i18next";

function AddContact({ open, onClose }) {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();

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
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary" onClick={() => form.submit()}>
                    {t("add", { defaultValue: "Add" })}
                </Button>,
            ]}
        >
            <Form layout="vertical"  form={form}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("name", { defaultValue: "Name" })}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter name",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("name", { defaultValue: "Enter Name", })} />
                        </Form.Item>

                        <Form.Item
                            label={t("email", { defaultValue: "Email" })}
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "Please enter valid email",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("email", { defaultValue: "Enter Email", })} />
                        </Form.Item>

                        <Form.Item
                            label={t("custom.fields", { defaultValue: "Custom Fields" })}
                            name="Custom Fields"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Custom Fields",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("custom.fields", { defaultValue: "Enter Custom Fields", })} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("phone.number", { defaultValue: "Phone Number" })}
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
                                placeholder={t("phone.number", { defaultValue: "Enter Phone Number", })}
                            />
                        </Form.Item>

                        <Form.Item label={t("groups", { defaultValue: "Groups" })}>
                            <Select
                                showSearch
                                placeholder={t("select.groups", { defaultValue: "Select Groups", })}
                                options={groups.map((group) => ({
                                    label: group,
                                    value: group,
                                }))}
                                popupRender={(menu) => (
                                    <>
                                        {menu}

                                        <Space.Compact block>
                                            <Input
                                                placeholder={t("group.name", { defaultValue: "Enter Group Name", })}
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
                                                {t("add.group", { defaultValue: "Add Group" })}
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