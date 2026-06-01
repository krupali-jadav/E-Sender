import { Button, Form, Input, Modal, Select } from "antd"

function AddCustomField({ open, onClose }) {
    return (
        <Modal
            title="Add Custom Field"
            open={open}
            onCancel={onClose}
            width={500}
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
                    label="Type"
                    name="type"
                >
                    <Select
                        placeholder="Text"
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
            </Form>

        </Modal>
    )
}

export default AddCustomField
