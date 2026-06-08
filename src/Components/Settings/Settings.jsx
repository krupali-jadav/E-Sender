import React from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Row,
  Col,
  Button,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import BasicInformation from "./BasicInformation";

const { TextArea } = Input;

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabItems = [
    {
      key: "/basic-information",
      label: "Basic Information",
    },
    {
      key: "/billing-details",
      label: "Billing Details",
    },
    {
      key: "/support",
      label: "Support",
    },
    {
      key: "/social-media",
      label: "Social Media",
    },
    {
      key: "/api-key",
      label: "API Key",
    },
  ];

  return (
    <PageContainer>
      <Card>
        {/* Tabs Header */}
        <Tabs
          type="card"
          activeKey={location.pathname}
          items={tabItems}
          onChange={(key) => navigate(key)}
        />
        <BasicInformation />
        {/* Basic Information Form */}
        {/* <Form layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Business Name"
                required
              >
                <Input placeholder="Enter Business Name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Business Category"
                required
              >
                <Input placeholder="Enter Business Category" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Address"
                required
              >
                <Input placeholder="Enter Address" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Website URL">
                <Input placeholder="Enter Website URL" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="About Your Business"
            required
          >
            <TextArea rows={5} />
          </Form.Item>

          <Button type="primary">
            Save
          </Button>
        </Form> */}               
      </Card>
    </PageContainer>
  );
};

export default Settings;