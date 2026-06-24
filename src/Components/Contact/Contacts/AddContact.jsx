import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Space, message, Divider, Tag, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "antd-phone-input";
import { t } from "i18next";
import { addContact, saveContact } from "./ContactsApi";
import { addGroup, getAllGroups } from "../Group/GroupApi";
import { getAllCustomFields } from "../Custom Field/CustomeFieldApi";

function AddContact({ open, onClose, editData, fetchContacts, }) {
    const [groupName, setGroupName] = useState("");
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();
    const [groupOptions, setGroupOptions] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);

    const handleFieldSelect = (fieldId) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""}${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };

    const fetchCustomFields = async () => {
        try {
            const data = await getAllCustomFields({
                page: 0,
                limit: 10,
            });

            if (data?.status) {
                setCustomFields(data.fields || []);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (open) {
            fetchGroups();
            fetchCustomFields();
        }
    }, [open]);

    const handleAddGroup = async () => {
        if (!groupName.trim()) {
            message.error("Please enter group name");
            return;
        }

        try {
            const data = await addGroup({
                name: groupName,
            });

            if (data?.status) {
                message.success(data?.message || "Group added successfully");
                setGroupName("");
                await fetchGroups();

                // Auto select new group
                if (data?.group?._id) {
                    const selectedGroups =
                        form.getFieldValue("groups") || [];

                    form.setFieldsValue({
                        groups: [
                            ...selectedGroups,
                            data.group._id,
                        ],
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                name: values.name,
                email: values.email,
                groups: values.groups || [],
                fields: selectedFields.map((fieldId) => ({
                    fieldId,
                    value:
                        customFields.find(
                            (item) => item._id === fieldId
                        )?.name || "",
                })),
            };
            const data = editData
                ? await saveContact({
                    contact_id: editData._id,
                    ...payload,
                })
                : await addContact(payload);

            if (data?.status) {
                message.success(
                    editData
                        ? data?.message || "Conact updated successfully"
                        : data?.message || "Conact added successfully"
                );

                form.resetFields();
                setPhone("");
                onClose();

                fetchContacts();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;

        if (editData) {
            form.setFieldsValue({
                name: editData.name,
                email: editData.email,
                groups:
                    editData.groups?.map(
                        (group) => group._id
                    ) || [],
            });

            setSelectedFields(
                editData.fields?.map(
                    (field) =>
                        field.fieldId?._id ||
                        field.fieldId
                ) || []
            );
        } else {
            form.resetFields();
            setSelectedFields([]);
            setPhone("");
        }
    }, [open, editData, form]);

    const fetchGroups = async () => {
        try {
            const data = await getAllGroups({
                page: 0,
                limit: 10,
                search: "",
                sort_by: "created-at",
                filter_by: {
                    date_type: "all",
                    date: {
                        start_date: null,
                        end_date: null,
                    },
                },
            });
            if (data?.status) {
                setGroupOptions(data.groups || []);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (open) {
            fetchGroups();
        }
    }, [open]);

    return (
        <Modal
            title={editData ? "Edit Contact" : "Add Contact"}
            open={open}
            onCancel={onClose}
            width={800}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary" loading={loading} onClick={() => form.submit()} >
                    {editData ? "Save Changes" : "Add"}
                </Button>
            ]}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
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

                        {customFields.length > 0 && (
                            <>
                                <div style={{ marginBottom: 12 }}>
                                    <strong>Custom Fields:</strong>
                                </div>

                                <Space wrap>
                                    {customFields.map((field) => (
                                        <Tag
                                            key={field._id}
                                            color={
                                                selectedFields.includes(field._id)
                                                    ? "blue"
                                                    : "default"
                                            }
                                            style={{
                                                cursor: "pointer",
                                                padding: "4px 8px",
                                            }}
                                            onClick={() => handleFieldSelect(field._id)}
                                        >
                                            {field.name}
                                        </Tag>
                                    ))}
                                </Space>
                            </>
                        )}
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

                        <Form.Item
                            name="groups"
                            label={t("groups", { defaultValue: "Groups" })}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder={t("select.groups", {
                                    defaultValue: "Select Groups",
                                })}
                                options={groupOptions.map((group) => ({
                                    label: group.name,
                                    value: group._id,
                                }))}
                                popupRender={(menu) => (
                                    <>
                                        {menu}

                                        <Space.Compact
                                            block
                                            style={{
                                                padding: 8,
                                            }}
                                        >
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
            </Form>
        </Modal>
    );
}

export default AddContact;