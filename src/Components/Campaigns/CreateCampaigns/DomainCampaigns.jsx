import { Button, Card, Col, Flex, Form, Input, Row, Space, Table } from "antd"
import { t } from "i18next"
import { Typography } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import PhonePreview from "./PhonePreview";
import { useState } from "react";
const { Text } = Typography;

function DomainCampaigns({ campaignData, setCampaignData, setCurrent }) {
  const [loading, setLoading] = useState(false);
  const rowSelection = {
    type: "radio",
    selectedRowKeys: campaignData.domainKey
      ? [campaignData.domainKey]
      : [],
    onChange: (selectedRowKeys, selectedRows) => {
      const key = selectedRowKeys[0];
      const row = selectedRows[0];
      setCampaignData((prev) => ({
        ...prev,
        domain: row.name,
        domainKey: key,
      }));
    },
  };

  const columns = [
    {
      title: t("sn", { defaultValue: "SN" }),
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setCampaignData((prev) => ({
              ...prev,
              domain: record.name,
              domainKey: record.key,
            }));
          }}
          style={{ padding: 0 }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: t("totalContacts", { defaultValue: "Total Contacts" }),
      dataIndex: "totalContacts",
      key: "totalContacts",
    },
    {
      title: t("blocked", { defaultValue: "Blocked" }),
      dataIndex: "blocked",
      key: "blocked",
    },
    {
      title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
      dataIndex: "unsubscribed",
      key: "unsubscribed",
    },
    {
      title: t("created_at", { defaultValue: "Created At" }),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("actions", { defaultValue: "Actions" }),
      key: "actions",
      render: () => (
        <MoreOutlined />
      ),
    },
  ];
  const data = [
    {
      key: "1",
      sn: "1",
      name: "example.com",
      totalContacts: 100,
      blocked: 5,
      unsubscribed: 10,
      createdAt: "2024-01-01",
    },
    {
      key: "2",
      sn: "2",
      name: "test.com",
      totalContacts: 100,
      blocked: 5,
      unsubscribed: 10,
      createdAt: "2024-01-01",
    },
  ]
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24} lg={14} xl={16} xxl={18}>
          <Card>
            <Form
              layout="vertical"
              initialValues={{ name: campaignData?.name }}
              onValuesChange={(changedValues) => {
                if (changedValues.name !== undefined) {
                  setCampaignData((prev) => ({
                    ...prev,
                    name: changedValues.name,
                  }));
                }
              }}
            >
              <Form.Item
                label={t("campaigns.name", { defaultValue: "Campaigns Name" })}
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Campaigns Name",
                  },
                ]}
              >
                <Input placeholder={t("enter.name", { defaultValue: "Enter Campaigns Name" })} />
              </Form.Item>
            </Form>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col>
                  <Text strong style={{ fontSize: 18 }}>Select Domain</Text>
                </Col>
                <Col xs={24} sm={24} md={26} lg={24} xl={8} xxl={10}>
                  <Input.Search
                    placeholder={t("search...", { defaultValue: "Search...", })}
                    enterButton={<SearchOutlined />}
                    allowClear
                  />
                </Col>
              </Row>
              <Table
                scroll={{ x: "max-content" }}
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                onRow={(record) => ({
                  onClick: () => {
                    setCampaignData((prev) => ({
                      ...prev,
                      domain: record.name,
                      domainKey: record.key,
                    }));
                  }
                })}
              />
            </Space>

          </Card>
          <Flex justify="end" style={{ marginTop: 16 }} gap={6}>
            <Button type="primary" loading={loading}>{t("save", { defaultValue: "Save" })}</Button>
            <Button
              type="primary"
              loading={loading}
              disabled={!campaignData.domain}
              onClick={() => setCurrent(1)}
            >
              Next
            </Button>
          </Flex>
        </Col>
        {/* Right Side */}
       <Col xs={24} md={24} lg={10} xl={8} xxl={6}>
          <PhonePreview
            page="DomainCampaign"
            template={campaignData?.template}
            domainName={campaignData.domain}
          />
        </Col>
      </Row>
    </Space >
  )
}

export default DomainCampaigns