import { Row, Col, Card, Button, Switch, Space, Typography, Tag, Divider, } from "antd";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SettingOutlined, ExportOutlined, FolderOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import SearchHeader from "../Search Header/SearchHeader";
import { useState } from "react";
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
  const [hovered, setHovered] = useState(false);
  return (

    <PageContainer
      extra={
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
      }>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>


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
          {/* 
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ width: 400 }}
            cover={
              <div
                style={{
                  height: 430,
                  background: "#bfbfbf",
                  position: "relative",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {hovered && (
                  <Space
                    size="middle"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate('/templates/create-template')} /> */}
          {/* <Button shape="circle" icon={<SettingOutlined />} /> */}
          {/* <Button danger shape="circle" icon={<DeleteOutlined />} /> */}
          {/* <Button shape="circle" icon={<ExportOutlined />} /> */}
          {/* </Space>
                )}


                <Tag
                  style={{
                    position: "absolute",
                    left: 12,
                    bottom: 12,
                  }}
                > */}
          {/* ID: {item.id} */}
          {/*</Tag>
               </div>
            }
          >
            <Typography.Title
              level={5}
              style={{ marginBottom: 16 }}
            > */}
          {/* {item.name} */}
          {/* </Typography.Title>
            <Row justify="space-between" align="middle" style={{ padding: 10 }}>
              <Col>
                <Space>
                  <Tag color="black" style={{ fontSize: 15 }}>Template</Tag> */}
          {/* <Tag>{item.id}</Tag> */}
          {/* </Space>
              </Col>

              <Col>
                <Switch />
              </Col>
            </Row>
            <Row justify="end" align="middle" style={{ padding: 10 }}>
              <Col>
                <Tag color="blue">3 minutes ago</Tag>
              </Col>
            </Row> */}

          {/* <Divider style={{ margin: "12px 0" }} /> */}

          {/* <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <FolderOutlined />
                  <span>Testing</span>
                </Space>
              </Col>
            </Row> */}
          {/* </Card> */}
        </Row>

      </Space>
    </PageContainer>
  );
}

export default Templates;