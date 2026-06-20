import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import PhonePreview from "./PhonePreview";
import { useState } from "react";

const { Text } = Typography;

function TemplateCampaigns() {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedRowKeys,) => {
      setSelectedRowKey(selectedRowKeys[0]);
    },
  };
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
      title: t("created.at", { defaultValue: "Created At" }),
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
      name: "Template 1",
      createdAt: "2024-01-01",
    },
    {
      key: "2",
      sn: "2",
      name: "Template 2",
      createdAt: "2024-01-01",
    }
  ]

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={[16, 16]} >
        <Col xs={24} lg={18}>
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Text strong style={{ fontSize: 15 }}>
                  {t("choose_template", { defaultValue: "Choose Template" })}
                  <MoreOutlined />
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
                    onClick={() => navigate('/templates/create-template')}
                  >
                    {t("add", { defaultValue: "Add" })}
                  </Button>

                </Flex>
              </Col>
            </Row>
          </Card>

          <Card styles={{ body: { padding: 0 } }} style={{ marginTop: 16 }}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={data}
              scroll={{ x: 700 }}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedRowKey(record.key);
                },
              })}
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
        <Col xs={24} lg={6}>
          <PhonePreview />
        </Col>
      </Row>
    </Space>
  );
}

export default TemplateCampaigns;