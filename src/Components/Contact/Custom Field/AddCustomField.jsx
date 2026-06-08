import { Button, Form, Input, Modal, Select } from "antd"
import { t } from "i18next"

function AddCustomField({ open, onClose }) {
    const [form] = Form.useForm();

    return (
        <Modal
            title={t("add_custom_field", { defaultValue: "Add Custom Field" })}
            open={open}
            onCancel={onClose}
            width={500}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary" onClick={()=>form.submit()}>
                    {t("add", { defaultValue: "Add" })}
                </Button>,
            ]}
        >

            <Form layout="vertical" form={form}>
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
                    placeholder={t("enter_name", { defaultValue: "Enter name" })} 
                    />
                </Form.Item>

                <Form.Item
                    label={t("type", { defaultValue: "Type" })}
                    name="type"
                >
                    <Select
                        placeholder={t("select_type", { defaultValue: "Select Type" })}
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
                    label={t("fallback_value", { defaultValue: "Fallback Value" })}
                    name="fallbackValue"
                    rules={[
                        {
                            required: true,
                            message: "Please enter fallback value",
                        },
                    ]}
                >
                    <Input 
                    placeholder={t("enter_fallback_value", { defaultValue: "Enter Fallback Value" })}
                     />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddCustomField
