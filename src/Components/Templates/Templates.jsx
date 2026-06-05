import { Row, Col, Card, Input, Button, Switch, Space, Typography, } from "antd";
import { SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import SearchHeader from "../Search Header/SearchHeader";
const { Title } = Typography;


function Templates() {
  const navigate = useNavigate();
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
              <Title level={3}>{t("templates", { defaultValue: "Templates" })}</Title>
            </Col>

            <Col>
              <Space>
                <Button danger icon={<DeleteOutlined />}>
                  {t("delete_all", { defaultValue: "Delete All" })}
                </Button>

                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => navigate("/templates/create-template")}
                >
                  {t("create_template", { defaultValue: "Create Template" })}
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Header */}
          <SearchHeader />

          {/* Template Cards */}
          <Row gutter={[16, 16]}>
            {templates.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  title={t("template", { defaultValue: item.name })}
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
                      // shape="round"
                      >
                        {t("edit", { defaultValue: "Edit" })}
                      </Button>
                    </Col>

                    <Col span={12}>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        block
                      // shape="round"

                      >
                        {t("delete", { defaultValue: "Delete" })}
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