import { Modal, Form, Input, Select, Button, Space,Table, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;

const ManualImport = ({ open, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleAddGroup = () => {
    if (!groupName.trim()) return;
    setGroups([...groups, groupName]);
    setGroupName("");
  };

  const columns = [
    {
      // title: t("sn", { defaultValue: "SN" }),
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      // title: t("name", { defaultValue: "Name" }),
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      // title: t("phone_number", { defaultValue: "Phone Number" }),
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      // title: t("email", { defaultValue: "Email" }),
      title: "Email",
      dataIndex: "email",
      key: "email",
    }
  ]

  return (
    <Modal
      title="Manual Import"
      open={open}
      onCancel={onClose}
      width={900}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          {/* {t("cancel", { defaultValue: "Cancel" })} */}
          Cancel
        </Button>,
        <Button key="import" type="primary">
          {/* {t("excel_import", { defaultValue: "Excel Import" })} */}
          Import
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Contacts">
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Groups">
          <Select
            mode="multiple"
            value={selectedGroups}
            onChange={(value) => setSelectedGroups(value)}
            showSearch
            placeholder="Select Groups"
            options={groups.map((group) => ({
              label: group,
              value: group,
            }))}
            popupRender={(menu) => (
              <>
                {menu}

                <Space.Compact block>
                  <Input
                    // placeholder={t("group_name", { defaultValue: "Enter Group Name",})}
                    placeholder="Enter Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddGroup}
                  >
                    {/* {t("add_group", { defaultValue: "Add Group" })} */}
                    Add Group
                  </Button>
                </Space.Compact>
              </>
            )}
          />
        </Form.Item>

        <Table
          columns={columns}
          dataSource={[]}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};

export default ManualImport;