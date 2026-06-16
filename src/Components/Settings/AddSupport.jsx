import { Button, Form, Input, message, Modal } from 'antd'
import PhoneInput from 'antd-phone-input';
import { t } from 'i18next'
import { useEffect, useState } from 'react';
import { addSupport, updateSupport } from './SettingApi';

function AddSupport({ open, onClose, onSuccess, editData }) {
    const [phone, setPhone] = useState("");
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                phone,
                department: values.department,
            };

            let data;

            if (editData?._id) {
                data = await updateSupport({
                    support_id: editData._id,
                    ...payload,
                });
            } else {
                data = await addSupport(payload);
            }

            if (data?.status) {
                message.success(
                    editData
                        ? "Support updated successfully"
                        : "Support added successfully"
                );

                onSuccess?.();
                form.resetFields();
                setPhone("");
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open && editData) {
            form.setFieldsValue({
                name: editData.name,
                department: editData.department,
            });

            setPhone(editData.phone || "");
        } else {
            form.resetFields();
            setPhone("");
        }
    }, [open, editData]);

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
            title={editData
                ? t("edit.support", {
                    defaultValue: "Edit Support",
                })
                : t("add.support", {
                    defaultValue: "Add Support",
                })}
            open={open}
            onCancel={onClose}
            width={500}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button
                    key="add"
                    type="primary"
                    onClick={() => form.submit()}
                >
                    {editData ? "Edit" : "Add"}
                </Button>
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
