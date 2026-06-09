import { Button, Card, Checkbox, Col, Empty, Flex, Form, Input, Row, Space, Table } from "antd"
import { t } from "i18next"
import { Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const { Text } = Typography;

function DomainCampaigns() {

  const columns = [
    {
      title: <Checkbox />,
      width: 70,
    },
    {
      title: t("sn", { defaultValue: "SN" }),
      dataIndex: "sn",
      key: "sn",
      width: 200
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("user", { defaultValue: "User" }),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t("status", { defaultValue: "Status" }),
      dataIndex: "status",
      key: "status",
    }
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Form layout="vertical">
          <Form.Item label={t("campaigns_name", { defaultValue: "Campaigns Name" })}
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Campaigns Name",
              },
            ]}>
            <Input placeholder={t("enter_name", { defaultValue: "Enter Campaigns Name" })} />
          </Form.Item>
        </Form>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col>
              <Text strong style={{ fontSize: 18 }}>Select Instance</Text>
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
            locale={{
              emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("no_instance_found", { defaultValue: "No Data" })} />
              )
            }} />
        </Space>

      </Card>
      <Flex justify="end">
        <Button type="primary">{t("save", { defaultValue: "Save" })}</Button>
      </Flex>
    </Space>
  )
}

export default DomainCampaigns
