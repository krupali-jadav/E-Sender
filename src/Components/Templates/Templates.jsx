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
      name: "Verify Email Template",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      active: true,
      subject: "Verify Your Email Address",
      body: `
<div style="max-width:600px;margin:auto;background:#fff;font-family:Arial;">
  <div style="padding:20px;text-align:center;">
    <h1 style="color:#0d47a1;">Your Site</h1>
  </div>

  <div style="background:#0d47a1;color:white;padding:40px;text-align:center;">
    <h2>Verify Your E-mail Address</h2>
  </div>

  <div style="padding:40px;text-align:center;">
    <p>Hi {{FirstName}},</p>

    <p>
      You're almost ready to get started.
      Please click the button below to verify your email.
    </p>

    <a
      href="{{VerifyUrl}}"
      style="
        background:#ff6f00;
        color:white;
        padding:12px 24px;
        text-decoration:none;
        border-radius:4px;
        display:inline-block;
      "
    >
      VERIFY YOUR EMAIL
    </a>

    <p style="margin-top:30px;">
      Thanks,<br/>
      The Company Team
    </p>
  </div>

  <div style="background:#f4f4f4;padding:20px;text-align:center;">
    <h3>Get in touch</h3>
    <p>+11 111 333 4444</p>
    <p>info@yourcompany.com</p>
  </div>
</div>
`,
    },
    {
      id: 2,
      name: "Test Template",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      active: true,
      subject: "Welcome to test template",
      body: `
<div style="max-width:600px;margin:auto;background:#ffffff;font-family:Arial,sans-serif;border:1px solid #e5e7eb;">

  <img
    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200"
    alt="Welcome"
    style="width:100%;height:220px;object-fit:cover;"
  />

  <div style="padding:40px;text-align:center;">
    <h1 style="color:#1677ff;margin-bottom:10px;">
      Welcome, {{FirstName}} 👋
    </h1>

    <p style="font-size:16px;color:#555;">
      We're excited to have you join the
      <strong> {{CompanyName}}</strong> community.
    </p>
  </div>

  <div style="padding:0 30px 30px;">
    <div style="background:#f5f7fa;padding:20px;border-radius:10px;margin-bottom:15px;">
      <h3 style="margin:0 0 10px 0;">🎯 Complete Your Profile</h3>
      <p style="margin:0;color:#666;">
        Add your information and personalize your experience.
      </p>
    </div>

    <div style="background:#f5f7fa;padding:20px;border-radius:10px;margin-bottom:15px;">
      <h3 style="margin:0 0 10px 0;">🚀 Explore Features</h3>
      <p style="margin:0;color:#666;">
        Discover all the tools available in your account.
      </p>
    </div>

    <div style="background:#f5f7fa;padding:20px;border-radius:10px;">
      <h3 style="margin:0 0 10px 0;">👥 Invite Your Team</h3>
      <p style="margin:0;color:#666;">
        Collaborate with teammates and boost productivity.
      </p>
    </div>
  </div>

  <div style="text-align:center;padding-bottom:40px;">
    <a
      href="{{LoginUrl}}"
      style="
        background:#1677ff;
        color:#fff;
        padding:14px 30px;
        border-radius:8px;
        text-decoration:none;
        font-weight:bold;
        display:inline-block;
      "
    >
      GET STARTED
    </a>
  </div>

  <div style="background:#001529;color:white;padding:30px;text-align:center;">
    <h3 style="margin-top:0;color:white;">
      Need Help?
    </h3>

    <p>
      📧 support@yourcompany.com
    </p>

    <p>
      📞 +91 98765 43210
    </p>

    <p style="margin-top:20px;font-size:12px;color:#ccc;">
      © {{CompanyName}}. All rights reserved.
    </p>
  </div>

</div>
`,
    }
  ];
  const [hovered, setHovered] = useState(false);
  return (

    <PageContainer
      extra={
        <Col>
          <Space>
            <Button danger icon={<DeleteOutlined />}>
              {t("delete.all", { defaultValue: "Delete All" })}
            </Button>

            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate("/templates/create-template")}
            >
              {t("create.template", { defaultValue: "Create Template" })}
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
                hoverable
              >
                <Card style={{ height: 380, overflow: "auto" }} onClick={() =>
                  navigate("/templates/create-template", {
                    state: {
                      template: item,
                    },
                  })
                }>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.body,
                    }}
                  />
                </Card>

                <Row gutter={12} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      block
                      onClick={() =>
                        navigate("/templates/create-template", {
                          state: {
                            template: item,
                          },
                        })
                      }
                    >
                      {t("edit", { defaultValue: "Edit" })}
                    </Button>
                  </Col>

                  <Col span={12}>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      block
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