import { Button, Card, Col, Flex, Form, Input, message, Row, Select, Space, Table } from "antd"
import { t } from "i18next"
import { Typography } from "antd";
import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import PhonePreview from "./PhonePreview";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;

function DomainCampaigns({ campaignData, setCampaignData, setCurrent }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
          <Space direction="vertical" style={{ width: "100%" }}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                initialValues={{ name: campaignData?.name }}
                onValuesChange={(changedValues) => {
                  if (changedValues.name !== undefined) {
                    form.setFieldsValue({
                      name: changedValues.name,
                    });

                    setCampaignData((prev) => ({
                      ...prev,
                      name: changedValues.name,
                    }));
                  }
                }}
              >
                <Row gutter={16} align="middle">
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tags"
                      name="tags"
                    >
                      <Select
                        mode="tags"
                        placeholder="Enter tags"
                        value={selectedTags}
                        options={tagOptions}
                        onChange={(value) => {
                          setSelectedTags(value);

                          setCampaignData((prev) => ({
                            ...prev,
                            tags: value,
                          }));

                          const updatedOptions = [
                            ...tagOptions,
                            ...value
                              .filter((tag) => !tagOptions.some((opt) => opt.value === tag))
                              .map((tag) => ({
                                label: tag,
                                value: tag,
                              })),
                          ];

                          setTagOptions(updatedOptions);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                  <Col>
                    <Title strong level={4}>{t("select.domain", { defaultValue: "Select Domain" })}</Title>
                  </Col>
                  <Col xs={24} sm={24} md={26} lg={24} xl={15} xxl={10}>
                    <Flex gap={6}>
                      <Input.Search
                        placeholder={t("search...", { defaultValue: "Search...", })}
                        enterButton={<SearchOutlined />}
                        allowClear
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/domains/add")}
                      >
                        {t("add.domain", { defaultValue: "Add Domain" })}
                      </Button>
                    </Flex>
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
            <Flex justify="end" gap={6}>
              <Button
                type="primary"
                loading={loading}
                onClick={async () => {
                  try {
                    await form.validateFields();
                    if (!campaignData.domain) {
                      message.warning("Please select a domain");
                      return;
                    }
                    setCurrent(1);
                  } catch (error) {
                    message.warning("Please enter Campaigns Name");
                  }
                }}
              >
                {t("next", { defaultValue: "Next" })}
              </Button>
            </Flex>
          </Space>
        </Col >
        {/* Right Side */}
        < Col xs={24} md={24} lg={10} xl={8} xxl={6} >
          <PhonePreview
            page="DomainCampaign"
            template={campaignData?.template}
            domainName={campaignData.domain}
          />
        </Col>
      </Row >
    </Space >
  )
}

export default DomainCampaigns