import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd'
import { t } from 'i18next'

function CreateWebHook({ open, onClose }) {

  const options = [
    {
      label: "Contacts",
      options: [
        {
          value: "contact.created",
          label: (
            <Space>
              <span style={{ color: "#34d399" }}>●</span>
              contact.created
            </Space>
          ),
        },
        {
          value: "contact.deleted",
          label: (
            <Space>
              <span style={{ color: "#fca5a5" }}>●</span>
              contact.deleted
            </Space>
          ),
        },
        {
          value: "contact.updated",
          label: (
            <Space>
              <span style={{ color: "#60a5fa" }}>●</span>
              contact.updated
            </Space>
          ),
        },
      ],
    },
    {
      label: "Domains",
      options: [
        {
          value: "domain.created",
          label: (
            <Space>
              <span style={{ color: "#34d399" }}>●</span>
              domain.created
            </Space>
          ),
        },
        {
          value: "domain.deleted",
          label: (
            <Space>
              <span style={{ color: "#fca5a5" }}>●</span>
              domain.deleted
            </Space>
          ),
        },
      ],
    },
  ];
  return (
    <Modal
      title="Create WebHook"
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button key="cancel" onClick={onClose}>
            {t("cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button key="add" type="primary">
            {t("add", { defaultValue: "Add" })}
          </Button>
        </Space>
      }
      centered
    >
      <Form layout="vertical">
        <Row >
          <Col span={24}>
            <Form.Item
              label={t("endpoint_url", { defaultValue: "Endpoint URL" })}
              name="endpoint"
              rules={[
                {
                  required: true,
                  message: "Please enter endpoint URL",
                },
              ]}
            >
              <Input
                placeholder={t("endpoint.url", { defaultValue: "https://", })} />
            </Form.Item>

            <Form.Item
              label={t("select.events", { defaultValue: "Select events to listen" })}
              name="select events to listen"
              rules={[
                {
                  required: true,
                  message: "Please select events to listen",
                },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="Search events..."
                style={{ width: "100%" }}
                options={options}
                optionFilterProp="value"
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </Modal>
  )
}

export default CreateWebHook