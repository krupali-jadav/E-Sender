import {
  Modal,
  List,
  Button,
  Space,
  Typography,
  Col,
} from "antd";
import {
  CheckCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "../../redux/reducers/reducer.app";

const { Text } = Typography;

function SwitchProjectModal({
  open,
  onCancel,
  projects,
  selectedProject,
  onProjectSelect,
  onCreateProject,
  onEditProject,
}) {
  const dispatch = useDispatch();

  return (
    <Modal
      title={t("Switch.project", {
        defaultValue: "Switch Project",
      })}
      open={open}
      onCancel={onCancel}
      footer={
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateProject}
          >
            Create Project
          </Button>
        </Col>
      }
    >
      <List
        style={{ overflow: "auto", height: 300 }}
        size="small"
        dataSource={projects}
        renderItem={(project) => {
          const isSelected =
            (selectedProject?._id ||
              selectedProject?.projectId) ===
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

                if (onProjectSelect) {
                  onProjectSelect(project);
                }

                onCancel();
              }}
              extra={
                <Space size={12}>
                  {isSelected && (
                    <CheckCircleFilled
                      style={{
                        color: "#52c41a",
                        fontSize: 18,
                      }}
                    />
                  )}

                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                  >
                    Edit
                  </Button>
                </Space>
              }
            >
              <List.Item.Meta
                title={project.name}
                description={
                  <Text
                    copyable={{
                      text:
                        project._id ||
                        project.projectId,
                    }}
                  >
                    {project._id || project.projectId}
                  </Text>
                }
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
}

export default SwitchProjectModal;