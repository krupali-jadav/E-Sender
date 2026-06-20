import { Button, Card, Col, Flex, Form, Input, Row, Space, Table } from "antd"
import { t } from "i18next"
import { Typography } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import PhonePreview from "./PhonePreview";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedDomain } from "../../../redux/reducers/reducer.Domain";
const { Text } = Typography;

function DomainCampaigns() {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedRowKeys,) => {
      setSelectedRowKey(selectedRowKeys[0]);
    },
  };
  const dispatch = useDispatch();

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
            dispatch(setSelectedDomain(record.name));
            setSelectedRowKey(record.key);
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
        // <Space>
        //   <Button size="small" type="primary">
        //     {/* {t("edit", { defaultValue: "Edit" })} */}
        //     Edit
        //   </Button>
        //   <Button size="small" danger>
        //     {/* {t("delete", { defaultValue: "Delete" })} */}
        //     Delete
        //   </Button>
        // </Space>
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
        <Col xs={24} lg={18}>
          <Card>
            <Form layout="vertical">
              <Form.Item label={t("campaigns.name", { defaultValue: "Campaigns Name" })}
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Campaigns Name",
                  },
                ]}>
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
                    setSelectedRowKey(record.key);
                    dispatch(setSelectedDomain(record.name));
                  },
                })}
              />
            </Space>

          </Card>
          <Flex justify="end" style={{ marginTop: 16 }}>
            <Button type="primary">{t("save", { defaultValue: "Save" })}</Button>
          </Flex>
        </Col>
        {/* Right Side */}
        <Col xs={24} lg={6}>
          <PhonePreview />
        </Col>
      </Row>
    </Space>
  )
}

export default DomainCampaigns
