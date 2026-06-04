import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../Search Header/SearchHeader'
import { Button, Card, Space, Table, Tag } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
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
    // title: t("totalContacts", { defaultValue: "Total Contacts" }),
    title: "Total Contacts",
    dataIndex: "totalContacts",
    key: "totalContacts",
  },
  {
    // title: t("blocked", { defaultValue: "Blocked" }),
    title: "Blocked",
    dataIndex: "blocked",
    key: "blocked",
  },
  {
    // title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
    title: "Unsubscribed",
    dataIndex: "unsubscribed",
    key: "unsubscribed",
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
