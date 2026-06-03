import React from "react";
import { Row, Col, Card, Input, Button, Switch, Space, Typography, Empty, } from "antd";
import { SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";

const { Title, Text } = Typography;

function Templates() {
  const templates = [
    {
      id: 1,
      name: "Test",
      active: true,
    },
  ];

  return (
    <PageContainer title={false}>
      <Card >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3}>Templates</Title>
            </Col>

            <Col>
              <Space>
                <Button danger icon={<DeleteOutlined />}>
                  {/* {t("delete_all", { defaultValue: "Delete All" })} */}
                  Delete All
                </Button>

                <Button type="primary" icon={<PlusCircleOutlined />}>
                  {/* {t("create_template", { defaultValue: "Create Template" })} */}
                  Create Template
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Search */}
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
                <Input.Search
                  // placeholder={t("search_leads", {
                  //     defaultValue: "Search Leads",
                  // })}
                  placeholder="Search Contacts"
                  enterButton={<SearchOutlined />}
                  allowClear
                />
              </Col>
            </Row>
          </Card>

          {/* Template Cards */}
          <Row gutter={[16, 16]}>
            {templates.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  title={item.name}
                  extra={<Switch defaultChecked={item.active} />}
                >
                  <Card style={{ height: 380 }}>

                  </Card>


                  <Row gutter={12} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        block
                        shape="round"
                      >
                        {/* {t("edit", { defaultValue: "Edit" })} */}
                        Edit
                      </Button>
                    </Col>

                    <Col span={12}>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        block
                        shape="round"
                      >
                        {/* {t("delete", { defaultValue: "Delete" })} */}
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </Card>
    </PageContainer>
  );
}

export default Templates;