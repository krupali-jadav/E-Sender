import { Button, Form, Input, message, Modal } from 'antd'
import { t } from 'i18next'
import { addGroup, saveGroup } from './GroupApi';
import { useEffect } from 'react';

function AddGroup({ open, onClose, editData, fetchGroups, }) {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            let data;

            if (editData) {
                data = await saveGroup({
                    group_id: editData._id,
                    name: values.name,
                });
            } else {
                data = await addGroup({
                    name: values.name,
                });
            }

            if (data?.status) {
                message.success(
                    editData
                        ? message.success(data?.message || "Conact updated successfully")
                        : message.success(data?.message || "Conact added successfully")
                );

                await fetchGroups(); // Refresh list

                form.resetFields();

                onClose(); // Close modal
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open && editData) {
            form.setFieldsValue({
                name: editData.name,
            });
        } else {
            form.resetFields();
        }
    }, [open, editData, form]);

    return (
        <>
            <Modal
                title={
                    editData
                        ? t("edit.group", { defaultValue: "Edit Group" })
                        : t("add.group", { defaultValue: "Add Group" })
                }
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
                        {editData
                            ? t("save.changes", { defaultValue: "Save Changes", })
                            : t("add", { defaultValue: "Add", })}
                    </Button>
                ]}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label={t("group.name", { defaultValue: "Group Name" })}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Group name",
                            },
                        ]}
                    >
                        <Input
                            placeholder={t("enter.group.name", { defaultValue: "Enter Group name" })}
                        />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default AddGroup