import { Button, Form, Input, Modal, Select } from "antd"

function AddCustomField({ open, onClose }) {
    return (
        <Modal
            title="Add Custom Field"
            // title={t("add_custom_field", { defaultValue: "Add Custom Field" })}
            open={open}
            onCancel={onClose}
            width={500}
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
                <Form.Item
                    label="Name"
                    // label={t("name", { defaultValue: "Name" })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter name",
                        },
                    ]}
                >
                    <Input 
                    placeholder="Enter name" 
                //    placeholder={t("enter_name", { defaultValue: "Enter name" })} 
                    />
                </Form.Item>

                <Form.Item
                    label="Type"
                    // label={t("type", { defaultValue: "Type" })}
                    name="type"
                >
                    <Select
                        placeholder="Text"
                        // placeholder= {t("select_type", { defaultValue: "Select Type" })} 
                        options={[
                            {
                                // label: t("text", {
                                //     defaultValue: "Text",
                                // }),
                                label: "Text",
                                value: "text",
                            },
                            {
                                // label: t("number", {
                                //     defaultValue: "number",
                                // }),
                                label: "Number",
                                value: "number",
                            },
                            {
                                // label: t("boolean", {
                                //     defaultValue: "boolean",
                                // }),
                                label: "Boolean",
                                value: "boolean",
                            },
                            {
                                // label: t("date", {
                                //     defaultValue: "date",
                                // }),
                                label: "Date",
                                value: "date",
                            },
                        ]}
                    />
                </Form.Item>

                 <Form.Item
                    label="Fallback Value"
                    // label={t("fallback_value", { defaultValue: "Fallback Value" })}
                    name="fallbackValue"
                    rules={[
                        {
                            required: true,
                            message: "Please enter fallback value",
                        },
                    ]}
                >
                    <Input
                     placeholder="Enter Fallback Value" 
                    // placeholder={t("enter_fallback_value", { defaultValue: "Enter Fallback Value" })}
                     />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddCustomField
