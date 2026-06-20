import { Modal, Button, Upload, Flex, Space, Card } from "antd";
import {
    UploadOutlined,
    CheckCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { t } from "i18next";

const { Dragger } = Upload;



function ExcelImport({ open, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const uploadProps = {
        accept: ".xlsx,.xls",
        multiple: false,
        showUploadList: true,
        beforeUpload: (file) => {
            setSelectedFile(file);
            return false;
        },
        onRemove: () => {
            setSelectedFile(null);
        },
    };
    return (
        <Modal
            title={t("excel.import", { defaultValue: "Excel Import" })}
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Flex justify="center" gap="small" align="center">
                    <Space size="middle" align="center">
                        <Button
                            type="primary"
                            shape="round"
                            icon={<CheckCircleOutlined />}
                        >
                            {t("upload", { defaultValue: "Upload" })}
                        </Button>

                        <RightOutlined />

                        <Button
                            shape="round"
                            disabled
                            icon={<CheckCircleOutlined />}
                        >
                            {t("save.contacts", { defaultValue: "Save Contacts" })}
                        </Button>
                    </Space>
                </Flex>
                <Card
                    size="small"
                // style={{ background: "#fafafa" }}
                >
                    <Dragger
                        // style={{ padding: "20px", background: "#fff" }}
                        {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>

                        <p className="ant-upload-text">
                            {t("upload.popup.excel.file", { defaultValue: "Upload Popup Excel File" })}
                        </p>
                    </Dragger>
                </Card>

                <Flex justify="end" gap="small">
                    <Button onClick={onClose}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>

                    <Button type="primary" disabled>
                        {t("next", { defaultValue: "Next" })}
                    </Button>
                </Flex>
            </Space>
        </Modal >
    );
}

export default ExcelImport;