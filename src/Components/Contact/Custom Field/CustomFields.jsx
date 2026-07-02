import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Col, DatePicker, Dropdown, Flex, Form, message, Modal, Row, Select, Space, Table, Typography } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AddCustomField from '../../Contact/Custom Field/AddCustomField';
import axiosInstance from '../../../util/axiosInstance';
import { formatDate, getCurrentTime } from '../../../util/commom.utils';
import { exportToExcel } from 'react-json-to-excel';
import { t } from 'i18next';
import { deleteCustomField, deleteMultipleFields, getAllCustomFields } from './CustomeFieldApi';
const { Text } = Typography;
const { RangePicker } = DatePicker;

function CustomFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("all-time");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Sort by Created At");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterForm] = Form.useForm();
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const [fieldType, setFieldType] = useState(-1);
  const resetFilterParameters = () => {
    setStatus("all");
    setPage(1);
    setSearch("");
    setIsApplyFilter(false);
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setStatus("all");
    // setSortBy(null);
    setShowFilterModal(false);
    filterForm.resetFields();
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const openEditModal = (record) => {
    setSelectedField(record);
    setEditModalOpen(true);
  };

  const OrderStatuses = [
    t("text", { defaultValue: "Text" }),
    t("number", { defaultValue: "Number" }),
    t("boolean", { defaultValue: "Boolean" }),
    t("date", { defaultValue: "Date" }),
  ];

  const getAllFields = async () => {
    try {
      setLoading(true);

      const data = await getAllCustomFields({
        page: page - 1,
        limit: 10,
        search: search,
        sort_by: sortBy,
        filter_by: isApplyFilter
          ? {
            date_type: startDate && endDate ? "specific" : "all",
            date: {
              start_date: startDate ? startDate.startOf("day").toISOString() : null,
              end_date: endDate ? endDate.endOf("day").toISOString() : null,
            },
            type: fieldType,
          } : {
            date_type: "all",
            date: {
              start_date: null,
              end_date: null,
            },
            type: -1,
          },
      });
      if (data?.status) {
        setFields(data?.fields || []);
        setTotal(data?.total || 0);
      }
    } catch (error) {
      console.log(error)
      message.error(error?.message || "Failed to fetch custom fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFields();
  }, [search, page, sortBy, isApplyFilter, fieldType, startDate, endDate,]);

  const handleDeleteFields = (ids, name = "") => {
    Modal.confirm({
      title: ids.length > 1 ? "Delete Fields" : "Delete Field",
      content:
        ids.length > 1
          ? `Are you sure you want to delete ${ids.length} fields?`
          : `Are you sure you want to delete "${name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          let data;

          if (ids.length === 1) {
            data = await deleteCustomField({
              field_id: ids[0],
            });
          } else {
            data = await deleteMultipleFields({
              field_ids: ids,
            });
          }

          if (data?.status) {
            message.success(
              data?.message || "Field(s) deleted successfully"
            );
            setSelectedRowKeys([]);
            getAllFields();
          }
        } catch (error) {
          console.log(error);
          message.error(error?.message || "Failed to delete field(s)");
        }
      },
    });
  };
  const onExport = async () => {
    try {
      setExporting(true);
      const { data } = await axiosInstance.post(`/api/user/custom-field/all`, {
        page: 0,
        limit: total,
        search: search,
        sortBy: sortBy,
      });

      if (data?.status) {
        console.log("Export API Response:", data);
        const customeFields = data?.fields || [];
        const exportData = customeFields?.map((fields) => ({
          FieldId: fields?._id,
          Name: fields?.name,
          type: fields?.type,
          TotalContact: fields?.totalContacts,
          FallbackValue: fields?.fallbackValue,
          createdAt: fields?.createdAt,
        }));
        exportToExcel(exportData, `all_Fields_${getCurrentTime()}`);
      } else {
        message.error(data?.message || "Failed to fetch Fields for export");
      }
    } catch (error) {
      message.error("An error occurred while exporting Fields", error);
    } finally {
      setExporting(false);
    }
  };
  const columns = [
    {
      title: t("sn", { defaultValue: "SN" }),
      key: "sn",
      render: (_, __, index) => index + 1,
      width: 100,
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
      width: 400,
      render: (_, record) => {
        return <Text>{record?.name ? record?.name : "N/A"}</Text>;
      },
    },
    {
      title: t("type", { defaultValue: "Type" }),
      dataIndex: "type",
      key: "type",
      render: (type) => {
        switch (type) {
          case 0:
            return "Text";
          case 1:
            return "Number";
          case 2:
            return "Boolean";
          case 3:
            return "Date";
          default:
            return "-";
        }
      },
    },
    {
      title: t("fallback.value", { defaultValue: "Fallback Value" }),
      dataIndex: "fallbackValue",
      key: "fallbackValue",
      render: (value, record) => {
        if (!value) return "N/A";

        if (record.type === 3) {
          return formatDate(value);
        }

        return value;
      },
    },
    {
      title: t("created.at", { defaultValue: "Created At" }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: t("actions", {
        defaultValue: "Actions",
      }),
      dataIndex: "actions",
      fixed: "right",
      key: "actions",
      width: 70,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: t("edit", {
                  defaultValue: "Edit",
                }),
                onClick: () => openEditModal(record),
              },
              {
                key: "2",
                label: t("delete", {
                  defaultValue: "Delete",
                }),
                danger: true,
                onClick: () =>
                  handleDeleteFields([record._id], record.name),
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <MoreOutlined
            style={{
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <PageContainer
      title="Custom Fields"
      breadcrumb={false}
      extra={
        <Flex gap="small" justify="flex-end" wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedField(null);
              setEditModalOpen(true);
            }}>
            {t("add.custom.field", { defaultValue: "Add Custom Field" })}
          </Button>

          <AddCustomField
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedField(null);
            }}
            editData={selectedField}
            onSuccess={getAllFields}
          />
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleDeleteFields(selectedRowKeys)}
          >
            Delete Selected
          </Button>
        </Flex>
      }
    >

      <Space direction="vertical" size="large" style={{ width: "100%" }}>

        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          onFilterClick={() => setShowFilterModal(true)}
          page="custom-fields"
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onReset={resetFilterParameters}
          searchValue={search}
          sortBy={sortBy}
          onSortChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
        />

        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={fields}
            loading={loading}
            scroll={{ x: "max-content", y: 500 }}
            rowSelection={rowSelection}
            pagination={{
              current: page,
              pageSize: 10,
              total: total,
              showSizeChanger: false,
              onChange: (newPage) => {
                setPage(newPage);
              },
            }}
          />
        </Card>

        <Modal
          title={t("filter.custom_fields", { defaultValue: "Filter Custom Fields" })}
          open={showFilterModal}
          centered
          onCancel={() => setShowFilterModal(false)}
          okText={t("apply", { defaultValue: "Apply" })}
          cancelText={t("cancel", { defaultValue: "Cancel" })}
          onOk={() => {
            setPage(1);
            setIsApplyFilter(true);
            setShowFilterModal(false);
          }}
        >
          <Form layout="vertical" form={filterForm}>
            <Form.Item
              label="Filter By Date"
            >
              <RangePicker
                style={{ width: "100%" }}
                value={startDate && endDate ? [startDate, endDate] : null}
                format="YYYY-MM-DD"
                onChange={(dates) => {
                  if (!dates) {
                    setStartDate(null);
                    setEndDate(null);
                  } else {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  }
                }}

              />
            </Form.Item>
            <Form.Item
              label={t("filterbytype", { defaultValue: "Filter by Type" })}
            >
              <Select
                value={fieldType}
                onChange={(value) => setFieldType(value)}
              >
                <Select.Option value={-1}>All</Select.Option>
                <Select.Option value={1}>Text</Select.Option>
                <Select.Option value={2}>Number</Select.Option>
                <Select.Option value={3}>Boolean</Select.Option>
                <Select.Option value={4}>Date</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageContainer >
  )
}

export default CustomFields