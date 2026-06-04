import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Flex, Space, Table, Tag } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AddCustomeField from './AddCustomField';

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
    // title: t("type", { defaultValue: "Type" }),
    title: "Type",
    dataIndex: "type",
    key: "type",
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
      //     Edit
      //   </Button>
      //   <Button size="small" danger>
      //     Delete
      //   </Button>
      // </Space>
    ),
  },
  
];


function CustomFields() {

  const [CustomFieldOpen, setCustomFieldOpen] = useState(false)
  return (
    <PageContainer
      title="Custom Fields"
      breadcrumb={false}
      extra={
        <Flex gap="small" justify="flex-end" wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCustomFieldOpen(true)}>
            {/* {t("add_custom_field", { defaultValue: "Add Custom Field" })} */}
            Add Custom Field
          </Button>

          <AddCustomeField
            open={CustomFieldOpen}
            onClose={() => setCustomFieldOpen(false)} />

        </Flex>
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
    </PageContainer >
  )
}

export default CustomFields
