import { Row, Col, Card, Button, Switch, Space, Spin, Empty } from "antd";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import SearchHeader from "../../Components/Search Header/SearchHeader";
import { useEffect, useState } from "react";
import CreateProjectModal from "./CreateProject";
import { getTemplatesByProject } from "./TemplatesApi";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "../../redux/reducers/reducer.app";
import SwitchProjectModal from "./SwichProjectModel";

function Templates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const selectedProject = useSelector(
    (state) => state.app.selectedProject
  );

  const getProjectTemplates = async (projectId) => {
    try {
      setLoading(true);

      const data = await getTemplatesByProject(projectId);

      if (data?.success) {
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getProjects = async () => {
    try {
      const response = await axiosInstance.get("/api/projects");

      if (response.data?.success) {
        const projectList = response.data.projects || [];

        setProjects(projectList);

        if (!selectedProject && projectList.length > 0) {
          dispatch(setSelectedProject(projectList[0]));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);
  useEffect(() => {
    if (selectedProject) {
      getProjectTemplates(
        selectedProject._id || selectedProject.projectId
      );
    }
  }, [selectedProject]);
  return (
    <>
      <Space style={{ padding: "16px 0px 0px 40px", fontSize: 15 }} size="small">
        <span style={{ fontWeight: "bold" }}>Project:</span>
        <Button
          type="link"
          onClick={() => setProjectModalOpen(true)}
          style={{ padding: 0, fontSize: 16 }}
        >
          {selectedProject?.name || "Select Project"}
        </Button>
        <span>{">"} Templates</span>
      </Space>
      <PageContainer
        extra={
          <Col>
            <Space>
              <CreateProjectModal
                open={open}
                onCancel={() => setOpen(false)}
                refreshProjects={getProjects}
                editProject={editProject}
              />
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
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
              <Spin size="middle" />
            </div>
          ) : templates.length === 0 ? (
            <Empty
              description="No Templates Available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                onClick={() => navigate("/templates/create-template")}
                icon={<PlusOutlined />}
              >
                Create Template
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {templates.map((item) => {
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                    <Card
                      title={item.JSON?.templateName}
                      extra={<Switch defaultChecked={item.active} />}
                      hoverable
                    >
                      <Card style={{ height: 380, overflow: "auto" }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.HTML || "<p>No preview available</p>",
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
                              navigate(`/templates/edit-template/${item._id}`)
                            }
                          >
                            {t("edit", { defaultValue: "Edit" })}
                          </Button>
                        </Col>

                        <Col span={12}>
                          <Button danger icon={<DeleteOutlined />} block>
                            {t("delete", { defaultValue: "Delete" })}
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}

        </Space>
        <SwitchProjectModal
          open={projectModalOpen}
          onCancel={() => setProjectModalOpen(false)}
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={(project) => {
            getProjectTemplates(
              project._id || project.projectId
            );
          }}
          onCreateProject={() => {
            setEditProject(null);
            setOpen(true);
          }}
          onEditProject={(project) => {
            setEditProject(project);
            setOpen(true);
          }}
        />
      </PageContainer >
    </>
  );
}

export default Templates;