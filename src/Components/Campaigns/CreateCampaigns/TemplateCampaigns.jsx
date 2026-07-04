import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Input, message, Popover, Row, Select, Space, Table, Typography, } from "antd";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import PhonePreview from "./PhonePreview";
import { useEffect, useState } from "react";
import { getTemplatesByProject } from "../../Templates/TemplatesApi";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../util/axiosInstance";
import { setSelectedProject } from "../../../redux/reducers/reducer.app";

const { Text } = Typography;

function TemplateCampaigns({ campaignData, setCampaignData, setCurrent }) {
  const dispatch = useDispatch();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
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

  const getProjects = async () => {
    try {
      const response = await axiosInstance.get("/api/projects");

      if (response.data?.success) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const tableData = (templates || [])
    .filter((item) =>
      item.JSON?.templateName?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((item, index) => ({
      key: item._id,
      sn: index + 1,
      name: item.JSON?.templateName,
      html: item.HTML,
      createdAt: item.createdAt?.split("T")[0],
      projectName: item.projectName || "-",
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
    selectedRowKeys: campaignData.templateKey
      ? [campaignData.templateKey]
      : [],
    onChange: (keys, rows) => {
      const row = rows[0];
      setCampaignData(prev => ({
        ...prev,
        templateKey: keys[0],
        template: {
          id: row.key,
          name: row.name,
          html: row.html,
        },
      }));

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
      title: t("project.name", { defaultValue: "Project Name" }),
      key: "projectName",
      render: (_, record) => record.projectName || "-",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={[16, 16]} >
        <Col xs={24} md={24} lg={14} xl={16} xxl={18}>
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Text strong style={{ fontSize: 15 }}>
                  Choose Template
                  {campaignData?.template && (
                    <span
                      style={{
                        color: "#1677ff",
                        marginLeft: 8,
                      }}
                    >
                      ({campaignData.template.name})
                    </span>
                  )}
                </Text>
              </Col>

              <Col xs={24} md={16}>
                <Flex justify="end" gap={10} wrap="wrap">
                  <Select
                    placeholder={t("select.project", { defaultValue: "Select Project" })}
                    value={selectedProject?._id || selectedProject?.projectId}
                    style={{ width: 250 }}
                    onChange={(value) => {
                      const project = projects.find(
                        (p) => (p._id || p.projectId) === value
                      );
                      dispatch(setSelectedProject(project));
                    }}
                    options={projects.map((project) => ({
                      label: project.name,
                      value: project._id || project.projectId,
                    }))}
                  />
                  <Input.Search
                    placeholder={t("search_templates", { defaultValue: "Search Templates" })}
                    allowClear
                    enterButton={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 350 }}
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
              loading={loading}
              columns={columns}
              pagination={false}
              dataSource={tableData}
              scroll={{ x: 700 }}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => {
                  setCampaignData(prev => ({
                    ...prev,
                    templateKey: record.key,
                    template: {
                      id: record.key,
                      name: record.name,
                      html: record.html,
                    },
                  }));
                }
              })}
            />
          </Card>

          <Flex justify="end" gap={10} wrap="wrap" style={{ marginTop: 16 }} >
            <Button onClick={() => setCurrent(0)}>
              {t("previous", { defaultValue: "Previous", })}
            </Button>

            <Button type="primary" onClick={() => setCurrent(2)}
              onClick={async () => {
                try {
                  if (!campaignData.template) {
                    message.warning("Please select a template");
                    return;
                  }
                  setCurrent(2);
                } catch (error) {
                  message.warning("Please select a template");
                }
              }}
            >
              {t("next", { defaultValue: "Next", })}
            </Button>
          </Flex>
        </Col>

        {/* Right Side */}
        <Col xs={24} md={24} lg={10} xl={8} xxl={6}>
          <PhonePreview
            template={campaignData?.template}
            domainName={campaignData?.domain}
          />
        </Col>
      </Row>

    </Space>
  );
}

export default TemplateCampaigns;