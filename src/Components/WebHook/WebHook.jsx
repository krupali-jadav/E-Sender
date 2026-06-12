import { CopyOutlined, PlusOutlined } from "@ant-design/icons"
import { PageContainer } from "@ant-design/pro-components"
import { Button, Card, Flex, Space, Table, Tag, Typography } from "antd"
import { t } from "i18next"
import { useState } from "react"
import CreateWebHook from "./CreateWebHook"
import { useNavigate } from "react-router-dom"

function WebHooks() {
    const navigate = useNavigate();
    const [webhooksOpen, setWebhooksOpen] = useState(false);
    const columns = [
        {
            title: t("endpoint", { defaultValue: "Endpoint" }),
            dataIndex: "endpoint",
            key: "endpoint",
            width: 300,
            render: (endpoint) => (
                <>
                    <Typography.Link
                        onClick={() => navigate("/webhook-details")}
                    >
                        {endpoint}
                    </Typography.Link>

                    {/* <CopyOutlined
                        onClick={() => {
                            navigator.clipboard.writeText(endpoint);
                            message.success("Copied!");
                        }}
                        style={{ cursor: "pointer" }}
                    /> */}
                </>
            ),
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            width: 300,
            key: "status",

            render: (status) => (
                <Tag color={status === "Enable" ? "green" : "gray"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: t("created", { defaultValue: "Created" }),
            dataIndex: "created",
            width: 300,
            key: "created",
        }
    ]

    const data = [
        {
            key: "1",
            endpoint: "https://resend.com/webhooks",
            status: "Enable",
            created: "11-06-2026",
        },
    ];
    return (
        <PageContainer extra={
            <Flex>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setWebhooksOpen(true)}>
                    {t("create.webhook", { defaultValue: "Create WebHook" })}
                </Button>
                <CreateWebHook
                    open={webhooksOpen}
                    onClose={() => setWebhooksOpen(false)}
                />
            </Flex>

        }>
            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            </Card>
        </PageContainer>
    )
}

export default WebHooks