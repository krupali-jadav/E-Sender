import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'

import { Button, Card, Flex, Form, Modal, Select, Space, Table, Tag } from 'antd'
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

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("all-time");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterForm] = Form.useForm();
  const resetFilterParameters = () => {
    setStatus("all");
    setPage(1);
    setSearch("");
    setIsApplyFilter(false);
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setStatus("all");
    setShowFilterModal(false);
    filterForm.resetFields();
  };

  const OrderStatuses = [
    // t("text", { defaultValue: "Text" }),
    "Text",
    // t("number", { defaultValue: "Number" }),
    'number',
    // t("boolean", { defaultValue: "Boolean" }),
    "boolean",
    // t("date", { defaultValue: "Date" }),
    "Date",
  ];

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

        <SearchHeader onFilterClick={() => setShowFilterModal(true)} page="custom-fields" />

        <Card >
          <Table
            columns={columns}
            // dataSource={data}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Card>

        <Modal
          // title={t("filter.orders", { defaultValue: "Filter Orders" })}
          title="Filter Instance"
          open={showFilterModal}
          centered
          onCancel={() => setShowFilterModal(false)}
          // okText={t("apply", { defaultValue: "Apply" })}
          okText="Apply"
          // cancelText={t("cancel", { defaultValue: "Cancel" })}
          cancelText="Cancel"
          onOk={() => {
            filterForm.validateFields().then(() => {
              setShowFilterModal(false);
              setPage(1);
              setIsApplyFilter(true);
              if (isApplyFilter) {
                getAllOrders();
              }
            });
          }}
        >
          <Form layout="vertical" form={filterForm}>
            <Form.Item
              // label={t("filterbystatus", { defaultValue: "Filter by Status" })}
              label="Filter by status"
            >
              <Select
                value={status}
              // onChange={(value) => {
              //     setStatus(value);
              // }}
              >
                <Option value="all">
                  {/* {t("all", { defaultValue: "All" })} */}
                  All
                </Option>
                {OrderStatuses?.map((status) => (
                  <Option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageContainer >
  )
}

export default CustomFields
