import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Flex, Table } from "antd";
import { t } from "i18next";
import AddSupport from "./AddSupport";
import { useState } from "react";
import { useSelector } from "react-redux";

function Support() {

  const [AddSupportOpen, setAddSupportOpen] = useState(false);
   const theme = useSelector((state) => state?.app?.theme);
  const columns = [
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("phone_number", { defaultValue: "Phone Number" }),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("department", { defaultValue: "Department" }),
      dataIndex: "department",
      key: "department",
    },
    {
      title: t("actions", { defaultValue: "Actions" }),
      key: "actions",
      render: () => (
        <MoreOutlined />
        // <Space>
        //   <Button size="small" type="primary">
        //     {/* {t("edit", { defaultValue: "Edit" })} */}
        //     Edit
        //   </Button>
        //   <Button size="small" danger>
        //     {/* {t("delete", { defaultValue: "Delete" })} */}
        //     Delete
        //   </Button>
        // </Space>
      ),
    },

  ];
  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
      }} >
      <Flex justify="end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddSupportOpen(true)}
        >
          {t("add", { defaultValue: "Add" })}
        </Button>
        <AddSupport
          open={AddSupportOpen}
          onClose={() => setAddSupportOpen(false)}
        />
      </Flex>

      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={[]}
      />
    </Card>
  )
}

export default Support