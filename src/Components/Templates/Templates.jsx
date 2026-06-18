import { Row, Col, Card, Button, Switch, Space, Modal, List } from "antd";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, CheckCircleFilled, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import SearchHeader from "../Search Header/SearchHeader";
import { useEffect, useState } from "react";
import CreateProjectModal from "./CreateProject";
import { getTemplatesByProject } from "./TemplatesApi";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "../../redux/reducers/reducer.app";


function Templates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  // const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
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
              <Button danger icon={<DeleteOutlined />}>
                {t("delete.all", { defaultValue: "Delete All" })}
              </Button>


              <CreateProjectModal
                open={open}
                onCancel={() => setOpen(false)}
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
          <Row gutter={[16, 16]}>
            {templates.map((item) =>(
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <Card
                    title={t("template", { defaultValue: item.name })}
                    // title={item.templateName}
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
              )
            )}
          </Row>

        </Space>
        <Modal
          open={projectModalOpen}
          footer={null}
          onCancel={() => setProjectModalOpen(false)}
          title={
            <Row justify="space-between" align="middle">
              <Col>
                <span>Switch Project</span>
              </Col>

              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setOpen(true)}
                  style={{ marginRight: 20 }}
                >
                  Create Project
                </Button>
              </Col>
            </Row>
          }
        >
          <Row justify="end" >

          </Row>
          <List
            size="small"
            dataSource={projects}
            renderItem={(project) => {
              const isSelected =
                (selectedProject?._id || selectedProject?.projectId) ===
                (project._id || project.projectId);

              return (
                <List.Item
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderRadius: 6,
                  }}
                  onClick={() => {
                    dispatch(setSelectedProject(project));
                    getProjectTemplates(
                      project._id || project.projectId
                    );

                    setProjectModalOpen(false);
                  }}
                  extra={
                    isSelected && (
                      <CheckCircleFilled
                        style={{
                          color: "#52c41a",
                          fontSize: 18,
                        }}
                      />
                    )
                  }
                >
                  <List.Item.Meta
                    title={project.name}
                    description={project._id || project.projectId}
                  />
                </List.Item>
              );
            }}
          />
        </Modal>
      </PageContainer>
    </>
  );
}

export default Templates;