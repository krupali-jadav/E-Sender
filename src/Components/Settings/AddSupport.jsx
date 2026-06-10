import { Button, Form, Input, Modal } from 'antd'
import PhoneInput from 'antd-phone-input';
import { t } from 'i18next'
import { useState } from 'react';

function AddSupport({ open, onClose }) {
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();
    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""
                }${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };
    return (
        <Modal
            title={t("add.custom.field", { defaultValue: "Add Custom Field" })}
            open={open}
            onCancel={onClose}
            width={500}
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
                        placeholder={t("enter.name", { defaultValue: "Enter name" })}
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label={t("phone.number", { defaultValue: "Phone Number" })}
                    initialValue={phone}
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
                        placeholder={t("phone.number", { defaultValue: "Enter Phone Number" })}

                    />
                </Form.Item>

                <Form.Item
                    label={t("department", { defaultValue: "Department" })}
                    name="department"
                    rules={[
                        {
                            required: true,
                            message: "Please enter department",
                        },
                    ]}
                >
                    <Input
                        placeholder={t("enter.department", { defaultValue: "Enter Department" })}
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddSupport
