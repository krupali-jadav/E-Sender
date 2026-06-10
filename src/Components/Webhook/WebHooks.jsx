import { PlusOutlined } from "@ant-design/icons"
import { PageContainer } from "@ant-design/pro-components"
import { Button, Card, Flex, Table } from "antd"
import { t } from "i18next"
import { useState } from "react"
import CreateWebHook from "./CreateWebHook"

function WebHooks() {
  const [webhooksOpen, setWebhooksOpen] = useState(false);
  const columns = [
    {
      title: t("endpoint", { defaultValue: "EndPoint" }),
      dataIndex: "endpoint",
      width: 400,
      key: "endpoint",
    },
    {
      title: t("status", { defaultValue: "Status" }),
      dataIndex: "status",
      width: 300,
      key: "status",
    },
    {
      title: t("created", { defaultValue: "Created" }),
      dataIndex: "created",
      width: 300,
      key: "created",
    }
  ]
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

    } >
      <Card>
        <Table
          columns={columns}
        />
      </Card>
    </PageContainer>
  )
}

export default WebHooks