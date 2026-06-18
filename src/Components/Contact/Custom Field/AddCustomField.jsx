import { Button, Form, Input, message, Modal, Select } from "antd"
import { t } from "i18next"
import { addCustomField, updateCustomField } from "./CustomeFieldApi";
import { useEffect, useState } from "react";

function AddCustomField({ open, onClose, onSuccess, editData }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const typeMap = {
                text: 1,
                number: 2,
                boolean: 3,
                date: 4,
            };

            let data;

            if (editData?._id) {
                data = await updateCustomField({
                    field_id: editData._id,
                    name: values.name,
                    type: typeMap[values.type],
                    fallbackValue: values.fallbackValue,
                });
            } else {
                data = await addCustomField({
                    name: values.name,
                    type: typeMap[values.type],
                    fallbackValue: values.fallbackValue,
                });
            }

            if (data?.status) {
                message.success(
                    editData
                        ? data?.message || "Custom-field updated successfully"
                        : data?.message || "Custom-field added successfully"
                );

                onSuccess?.();
                form.resetFields();
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open && editData) {
            form.setFieldsValue({
                name: editData.name,
                fallbackValue: editData.fallbackValue,
                type:
                    editData.type === 1
                        ? "text"
                        : editData.type === 2
                            ? "number"
                            : editData.type === 3
                                ? "boolean"
                                : "date",
            });
        } else {
            form.resetFields();
        }
    }, [open, editData, form]);
    return (
        <Modal
            title={
                editData
                    ? t("edit.custom.field", {
                        defaultValue: "Edit Custom Field",
                    })
                    : t("add.custom.field", {
                        defaultValue: "Add Custom Field",
                    })
            }
            open={open}
            onCancel={onClose}
            width={500}
            centered
            footer={[
                <Button key="cancel" disabled={loading} onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary" loading={loading} onClick={() => form.submit()}>
                    {editData
                        ? t("edit", { defaultValue: "Edit" })
                        : t("add", { defaultValue: "Add" })}
                </Button>,
            ]}
        >

            <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
                        placeholder={t("enter.name", { defaultValue: "Enter name" })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("type", { defaultValue: "Type" })}
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: "Please select type",
                        },
                    ]}
                >
                    <Select
                        placeholder={t("select.type", { defaultValue: "Select Type" })}
                        options={[
                            {
                                label: t("text", {
                                    defaultValue: "Text",
                                }),
                                value: "text",
                            },
                            {
                                label: t("number", {
                                    defaultValue: "number",
                                }),
                                value: "number",
                            },
                            {
                                label: t("boolean", {
                                    defaultValue: "boolean",
                                }),
                                value: "boolean",
                            },
                            {
                                label: t("date", {
                                    defaultValue: "date",
                                }),
                                value: "date",
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={t("fallback.value", { defaultValue: "Fallback Value" })}
                    name="fallbackValue"
                    rules={[
                        {
                            required: true,
                            message: "Please enter fallback value",
                        },
                    ]}
                >
                    <Input
                        placeholder={t("enter.fallback.value", { defaultValue: "Enter Fallback Value" })}
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddCustomField
