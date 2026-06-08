import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Table } from "antd";
import { t } from "i18next";
import AddSupport from "./AddSupport";
import { useState } from "react";

function Support() {

   const [AddSupportOpen, setAddSupportOpen] = useState(false);
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
    <>
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
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No Data"
            />
          ),
        }}
        columns={columns}
        dataSource={[]}
      />
    </>
  )
}

export default Support