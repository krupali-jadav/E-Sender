import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Space, message, Typography, DatePicker, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "antd-phone-input";
import { t } from "i18next";
import { addContact, saveContact, getAllContacts } from "./ContactsApi";
import { addGroup, getAllGroups } from "../Group/GroupApi";
import { getAllCustomFields } from "../Custom Field/CustomeFieldApi";
import { isValidPhoneNumber } from "../../../util/commom.utils";
const { Text } = Typography;
import dayjs from "dayjs";

function AddContact({ open, onClose, editData, fetchContacts, onSave, showGroups }) {
    const [groupName, setGroupName] = useState("");
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();
    const [groupOptions, setGroupOptions] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fieldValues, setFieldValues] = useState({});

    const handlePhoneChange = (value) => {
        const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""}${value?.phoneNumber ?? ""}`;

        setPhone(fullPhoneNumber);

        form.validateFields(["phone"]);
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

            const response = await getAllContacts({
                page: 0,
                limit: 20,
                search: "",
            });

            if (response?.status) {
                const email = values.email.trim().toLowerCase();

                const isDuplicate = response.contacts.some((contact) => {
                    if (editData && contact._id === editData._id) {
                        return false;
                    }

                    return (
                        contact.email &&
                        contact.email.trim().toLowerCase() === email
                    );
                });

                if (isDuplicate) {
                    message.error("This email already exists.");
                    setLoading(false);
                    return;
                }
            }
            const payload = {
                name: values.name,
                email: values.email,
                groups: values.groups || [],
                phonenumber: phone,
                fields: customFields
                    .filter((field) => {
                        const value = fieldValues[field._id];

                        if (field.type === 3) {
                            return value != null;
                        }
                        return value && String(value).trim() !== "";
                    })
                    .map((field) => ({
                        fieldId: field._id,
                        value:
                            field.type === 3
                                ? fieldValues[field._id].format("YYYY-MM-DD")
                                : fieldValues[field._id],
                    })),
            };
            if (onSave) {
                onSave({
                    ...editData,
                    _id: editData?._id || Date.now().toString(),
                    ...payload,
                    phonenumber: phone,
                });
                message.success(
                    editData
                        ? "Contact updated successfully"
                        : "Contact added successfully"
                );
                form.resetFields();
                setPhone("");
                setFieldValues({});
                onClose();
                return;
            }
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
            message.error(error?.message || "Failed to add contact");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            if (editData) {
                form.setFieldsValue({
                    name: editData.name,
                    email: editData.email,
                    phone: editData.phonenumber,
                    groups: editData.groups?.map((g) => g._id),
                });

                const customFieldData = {};

                editData.fields?.forEach((item) => {
                    const fieldId = item.fieldId?._id || item.fieldId;
                    const fieldType = item.fieldId?.type;

                    customFieldData[fieldId] =
                        fieldType === 3 && item.value
                            ? dayjs(item.value)
                            : item.value;
                });

                setFieldValues(customFieldData);
            } else {
                form.resetFields();
                setPhone("");
                setFieldValues({});
            }
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
            title={editData ? t("edit.contact", { defaultValue: "Edit Contact" }) : t("add.contact", { defaultValue: "Add Contact" })}
            open={open}
            onCancel={onClose}
            width={800}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary" loading={loading} onClick={() => form.submit()} >
                    {editData ? t("update", { defaultValue: "Update" }) : t("add", { defaultValue: "Add" })}
                </Button>
            ]}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("name", { defaultValue: "Name" })}
                            name="name"
                        >
                            <Input
                                placeholder={t("enter.name", { defaultValue: "Enter Name", })} />
                        </Form.Item>

                        <Form.Item
                            label={t("email", { defaultValue: "Email" })}
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: t("enter.valid.email", { defaultValue: "Please enter valid email" }),
                                },
                                {
                                    required: true,
                                    message: t("enter.email", { defaultValue: "Please enter email" }),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("enter.email", { defaultValue: "Enter Email", })} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("phone.number", { defaultValue: "Phone Number" })}
                            name="phone"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        // Optional field
                                        if (!phone || phone.trim() === "") {
                                            return Promise.resolve();
                                        }
                                        if (!isValidPhoneNumber(phone)) {
                                            return Promise.reject(
                                                new Error("Please enter a valid 10 digit phone number")
                                            );
                                        }
                                        return Promise.resolve();
                                    },
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
                        {showGroups && (
                            <Form.Item
                                name="groups"
                                label="Groups"
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
                                                    {t("add.group", { defaultValue: "Add Group" })}
                                                </Button>
                                            </Space.Compact>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        )}
                    </Col>

                </Row>
                <div style={{ marginBottom: 12 }}>
                    <Text strong>Custom Fields :</Text>
                </div>
                <Row gutter={16}>
                    {customFields.map((field) => (
                        <Col span={12} key={field._id}>
                            <Form.Item label={field.name}>
                                {field.type === 3 ? (
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        placeholder={`Select ${field.name}`}
                                        value={
                                            dayjs.isDayjs(fieldValues[field._id])
                                                ? fieldValues[field._id]
                                                : null
                                        }
                                        onChange={(date) =>
                                            setFieldValues((prev) => ({
                                                ...prev,
                                                [field._id]: date,
                                            }))
                                        }
                                    />
                                ) : (
                                    <Input
                                        placeholder={`Enter ${field.name}`}
                                        value={fieldValues[field._id] || ""}
                                        onChange={(e) =>
                                            setFieldValues((prev) => ({
                                                ...prev,
                                                [field._id]: e.target.value,
                                            }))
                                        }
                                    />
                                )}

                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Modal >
    );
}

export default AddContact;
