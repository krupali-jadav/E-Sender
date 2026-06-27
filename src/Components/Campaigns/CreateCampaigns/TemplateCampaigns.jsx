import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Input, Popover, Row, Space, Table, Typography, } from "antd";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import PhonePreview from "./PhonePreview";
import { useEffect, useState } from "react";
import { getTemplatesByProject } from "../../Templates/TemplatesApi";
import { useSelector } from "react-redux";

const { Text } = Typography;

function TemplateCampaigns() {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const selectedProject = useSelector((state) => state.app.selectedProject);

  const getProjectTemplates = async (projectId) => {
    setLoading(true);

    try {
      const response = await getTemplatesByProject(projectId);
      console.log("API Response:", response);
      if (response?.success) {
        setTemplates(response.templates || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      getProjectTemplates(
        selectedProject._id || selectedProject.projectId
      );
    }
  }, [selectedProject]);

  const tableData = (templates || []).map((item, index) => ({
    key: item._id,
    sn: index + 1,
    name: item.JSON?.templateName,
    html: item.HTML,
    createdAt: item.createdAt?.split("T")[0],
  }));

  const TemplatePreview = ({ html }) => (
    <iframe
      srcDoc={html}
      title="Template Preview"
      style={{
        width: 280,
        height: 400,
        border: "1px solid #d9d9d9",
        borderRadius: 8,
        background: "#fff",
      }}
    />
  );

  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKey(selectedRowKeys[0]);
      setSelectedTemplate(selectedRows[0]);
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
      render: (text, record) => (
        <Popover
          placement="rightTop"
          trigger="hover"
          content={<TemplatePreview html={record.html} />}
        >
          <span style={{ color: "#1677ff", cursor: "pointer", }}>
            {text}
          </span>
        </Popover>
      ),
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
      ),
    },
  ];

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
              dataSource={tableData}
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
          <PhonePreview template={selectedTemplate} />
        </Col>
      </Row>
    </Space>
  );
}

export default TemplateCampaigns;