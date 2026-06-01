import { Button, Modal } from 'antd'
import React from 'react'

function AddContact({ open, onClose }) {
    return (
        // <div>AddContact</div>
        <Modal
            title="Add Contact"
            open={open}
            onCancel={onClose}
            width={900}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="import" type="primary">
                    Import
                </Button>,
            ]}
        >

        </Modal>
    )
}

export default AddContact