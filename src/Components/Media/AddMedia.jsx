import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Modal, Space } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { t } from 'i18next'
import React from 'react'

function AddMedia({ open, onClose, onAdd }) {
    return (
        <Modal
            title={t("add.media", { defaultValue: "Add Media" })}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card
                    size="small"
                // style={{ background: "#fafafa" }}
                >
                    <Dragger
                    // style={{ padding: "20px", background: "#fff" }}
                    // {...uploadProps}
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>

                        <p className="ant-upload-text">
                            {t("upload.to.media", { defaultValue: "Upload to Media" })}
                        </p>
                    </Dragger>
                </Card>

                <Flex justify="end" gap="small">
                    <Button onClick={onClose}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>

                    <Button type="primary" onClick={onAdd}>
                        {t("upload", { defaultValue: "Upload" })}
                    </Button>
                </Flex>
            </Space>
        </Modal >
    )
}

export default AddMedia