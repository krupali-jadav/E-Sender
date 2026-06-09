import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

function TemplateCampaigns() {
  const navigate = useNavigate();
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
      title: t("created_at", { defaultValue: "Created At" }),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("actions", { defaultValue: "Actions" }),
      key: "actions",
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Text strong style={{ fontSize: 15 }}>
                  {t("export", { defaultValue: "Choose Template" })}Choose Template
                </Text>
              </Col>

              <Col xs={24} md={16}>
                <Flex justify="end" gap={10} wrap="wrap">
                  <Input.Search
                    placeholder={t("search...", { defaultValue: "Search...", })}
                    enterButton={<SearchOutlined />}
                    allowClear
                    style={{ width: "100%", maxWidth: 350 }}
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/templates')}
                  >
                    {t("add", { defaultValue: "Add" })}
                  </Button>

                </Flex>
              </Col>
            </Row>
          </Card>

          <Card bodyStyle={{ padding: 0 }} style={{ marginTop: 16 }}>
            <Table
              columns={columns}
              pagination={false}
              scroll={{ x: 700 }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t("no_data", {
                      defaultValue: "No Data",
                    })}
                  />
                ),
              }}
            />
          </Card>

          <Flex justify="end" gap={10} wrap="wrap" style={{ marginTop: 16 }} >
            <Button>
              {t("previous", { defaultValue: "Previous", })}
            </Button>

            <Button type="primary">
              {t("next", { defaultValue: "Next", })}
            </Button>
          </Flex>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={8}>

        </Col>
      </Row>
    </Space>
  );
}

export default TemplateCampaigns;