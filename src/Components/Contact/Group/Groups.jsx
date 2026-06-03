import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../Search Header/SearchHeader'
import { Button, Card, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AddGroup from './AddGroup';
import { useState } from 'react';

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
    // title: t("phone", { defaultValue: "Phone" }),
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    // title: t("email", { defaultValue: "Email" }),
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    // title: t("company", { defaultValue: "Company" }),
    title: "Company",
    dataIndex: "company",
    key: "company",
  },
  {
    // title: t("status", { defaultValue: "Status" }),
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "Active" ? "green" : "red"}>
        {status}
      </Tag>
    ),
  },
  {
    // title: t("created_at", { defaultValue: "Created At" }),
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    // title: t("actions", { defaultValue: "Actions" }),
    title: "Actions",
    key: "actions",
    render: () => (
      <Space>
        <Button size="small" type="primary">
          {/* {t("edit", { defaultValue: "Edit" })} */}
          Edit
        </Button>
        <Button size="small" danger>
          {/* {t("delete", { defaultValue: "Delete" })} */}
          Delete
        </Button>
      </Space>
    ),
  },
];


function Groups() {
  const [AddGroupOpen, setAddGroupOpen] = useState(false);
  return (
    <PageContainer
      title="Groups"
      breadcrumb={false}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddGroupOpen(true)}
            >
            {/* {t("add_group", { defaultValue: "Add Group" })} */}
            Add Group
          </Button>

          <AddGroup      
            open={AddGroupOpen}
            onClose={() => setAddGroupOpen(false)} />
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <SearchHeader />

        <Card >
          <Table
            columns={columns}
            // dataSource={data}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </Space>
    </PageContainer>
  )
}

export default Groups
