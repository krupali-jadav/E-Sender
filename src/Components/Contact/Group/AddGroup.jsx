import { Button, Form, Input, Modal } from 'antd'
import React from 'react'

function AddGroup({ open, onClose }) {
    return (
        <>
            <Modal
                title="Add Group"
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
                        label="Group Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Group name",
                            },
                        ]}
                    >
                        <Input placeholder="Enter Group name" />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default AddGroup