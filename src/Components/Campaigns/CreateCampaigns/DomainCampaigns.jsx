import { Button, Card, Checkbox, Col, Empty, Flex, Form, Input, Row, Space, Table } from "antd"
import { t } from "i18next"
import { Typography } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
const { Text } = Typography;

function DomainCampaigns() {

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
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
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
            <Col xs={24} sm={24} md={26} lg={24} xl={8} xxl={12}>
              <Input.Search
                placeholder={t("search...", { defaultValue: "Search...", })}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
          </Row>
          <Table
          scroll={{x:"max-content"}}
            columns={columns}
           />
        </Space>

      </Card>
      <Flex justify="end">
        <Button type="primary">{t("save", { defaultValue: "Save" })}</Button>
      </Flex>
    </Space>
  )
}

export default DomainCampaigns
