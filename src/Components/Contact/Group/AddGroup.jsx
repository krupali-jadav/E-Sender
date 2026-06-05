import { Button, Form, Input, Modal } from 'antd'
import { t } from 'i18next'

function AddGroup({ open, onClose }) {
    return (
        <>
            <Modal
                title="Add Group"
                // title= {t("add_group", { defaultValue: "Add Group" })} 
                open={open}
                onCancel={onClose}
                width={500}
                centered
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>,
                    <Button key="add" type="primary">
                        {t("add", { defaultValue: "Add" })}
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item
                        label={t("group_name", { defaultValue: "Group Name" })}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Group name",
                            },
                        ]}
                    >
                        <Input
                         placeholder={t("enter_group_name", { defaultValue: "Enter Group name" })} 
                         />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default AddGroup