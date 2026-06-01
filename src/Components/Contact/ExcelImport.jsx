import { Modal, Button, Upload, Flex, Space, Card } from "antd";
import {
    UploadOutlined,
    CheckCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

function ExcelImport({ open, onClose }) {
    return (
        <Modal
            title="Excel Import"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Flex justify="center" gap="small" align="center">
                <Space size="middle" align="center" centered>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<CheckCircleOutlined />}
                    >
                        {/* {t("upload", { defaultValue: "Upload" })} */}
                        Upload
                    </Button>

                    <RightOutlined />

                    <Button
                        shape="round"
                        disabled
                        icon={<CheckCircleOutlined />}
                    >
                         {/* {t("save_contacts", { defaultValue: "Save Contacts" })} */}
                        Save Contacts
                    </Button>
                </Space>
                </Flex>
                <Card size="small" style={{ background: "#fafafa" }}>
                    <Dragger style={{ padding: "20px", background: "#fff" }}
                        multiple={false}
                        showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>

                        <p className="ant-upload-text">
                            Upload Popup Excel File
                        </p>
                    </Dragger>
                </Card>

                <Flex justify="end" gap="small">
                    <Button onClick={onClose}>
                          {/* {t("cancel", { defaultValue: "Cancel" })} */}
                        Cancel
                    </Button>

                    <Button type="primary" disabled>
                          {/* {t("next", { defaultValue: "Next" })} */}
                        Next
                    </Button>
                </Flex>
            </Space>
        </Modal >
    );
}

export default ExcelImport;