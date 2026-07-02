import { UploadOutlined } from '@ant-design/icons'
import { Button, Card, Flex, message, Modal, Space } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { t } from 'i18next'
import { useState } from 'react'
import { addMedia, addMultipleMedia } from './MediaApi'

function AddMedia({ open, onClose, fetchMedia }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const uploadProps = {
        multiple: true,

        beforeUpload: (file) => {
            setSelectedFiles((prev) => [...prev, file]);
            return false;
        },

        onRemove: (file) => {
            setSelectedFiles((prev) =>
                prev.filter((f) => f.uid !== file.uid)
            );
        },
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!selectedFiles.length) {
            message.error("Please select files");
            return;
        }
        const firstFile = selectedFiles[0];

        let mediaType = "other";

        if (firstFile.type.startsWith("image/")) {
            mediaType = "image";
        } else if (firstFile.type.startsWith("video/")) {
            mediaType = "video";
        } else if (firstFile.type.startsWith("application/")) {
            mediaType = "document";
        }

        const data =
            selectedFiles.length === 1
                ? await addMedia(selectedFiles[0], mediaType)
                : await addMultipleMedia(selectedFiles, mediaType);

        if (data?.status) {
            message.success(data?.message || "Media uploaded successfully");

            await fetchMedia();
            setSelectedFiles([]);
            onClose();
            handleClose();
        } else {
            message.error(data?.message || "Invalid media type");
        }
    };

    const handleClose = () => {
        setSelectedFiles([]);
        onClose();
    };

    return (
        <Modal
            title={t("add.media", { defaultValue: "Add Media" })}
            open={open}
            onCancel={handleClose}
            footer={null}
            width={600}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card
                    size="small"
                >
                    <Dragger {...uploadProps} fileList={selectedFiles}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>

                        <p className="ant-upload-text">
                            {t("upload.to.media", { defaultValue: "Upload to Media" })}
                        </p>
                    </Dragger>
                </Card>

                <Flex justify="end" gap="small">
                    <Button onClick={handleClose}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>

                    <Button type="primary" onClick={handleUpload} loading={loading}>
                        {t("upload", { defaultValue: "Upload" })}
                    </Button>
                </Flex>
            </Space>
        </Modal >
    )

}
export default AddMedia