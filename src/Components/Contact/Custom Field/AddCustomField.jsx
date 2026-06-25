import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd"
import { t } from "i18next"
import { addCustomField, updateCustomField } from "./CustomeFieldApi";
import { useEffect, useState } from "react";
import { formatDate } from "../../../util/commom.utils";
import dayjs from "dayjs";

function AddCustomField({ open, onClose, onSuccess, editData }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const typeMap = {
                text: 0,
                number: 1,
                boolean: 2,
                date: 3,
            };

            let fallbackValue = values.fallbackValue;

            if (values.type === "date" && values.fallbackValue) {
                fallbackValue = values.fallbackValue.toISOString();
            }

            let data;

            if (editData?._id) {
                data = await updateCustomField({
                    field_id: editData._id,
                    name: values.name,
                    type: typeMap[values.type],
                    fallbackValue,
                });
            } else {
                data = await addCustomField({
                    name: values.name,
                    type: typeMap[values.type],
                    fallbackValue,
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
        if (!open) return;

        if (editData) {
            const typeValue =
                editData.type === 0
                    ? "text"
                    : editData.type === 1
                        ? "number"
                        : editData.type === 2
                            ? "boolean"
                            : editData.type === 3
                                ? "date"
                                : undefined;

            setSelectedType(typeValue);

            form.setFieldsValue({
                name: editData.name || "",
                type: typeValue,

                fallbackValue:
                    typeValue === "date" && editData.fallbackValue
                        ? dayjs(editData.fallbackValue)
                        : editData.fallbackValue,
            });
        } else {
            form.resetFields();
            setSelectedType(undefined);
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
                        onChange={(value) => setSelectedType(value)}
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
                    {selectedType === "date" ? (
                        <DatePicker
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                            value={form.getFieldValue("fallbackValue")}
                            onChange={(date) => {
                                form.setFieldsValue({
                                    fallbackValue: date,
                                });
                            }}
                        />
                    ) : (
                        <Input
                            placeholder={t("enter.fallback.value", {
                                defaultValue: "Enter Fallback Value",
                            })}
                        />
                    )}
                </Form.Item>

            </Form>

        </Modal>
    )
}

export default AddCustomField
