import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Dropdown, Flex, Form, message, Modal, Select, Space, Table, Typography } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AddCustomField from '../../Contact/Custom Field/AddCustomField';
import axiosInstance from '../../../util/axiosInstance';
import { formatDate, getCurrentTime } from '../../../util/commom.utils';
import { exportToExcel } from 'react-json-to-excel';
import { t } from 'i18next';
import { deleteCustomField, getAllCustomFields } from './CustomeFieldApi';
const { Text } = Typography;

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
  const [sortBy, setSortBy] = useState("created-at");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterForm] = Form.useForm();
  const resetFilterParameters = () => {
    setStatus("all");
    setPage(1);
    setSearch("");
    // setIsApplyFilter(false);
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setStatus("all");
    setShowFilterModal(false);
    filterForm.resetFields();
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
        filter_by: {
          date_type: "all",
          date: {
            start_date: null,
            end_date: null,
          },
        },
      });

      if (data?.status) {
        setFields(data?.fields || []);
        setTotal(data?.total || 0);
      }
    } catch (error) {
      console.log(error)
      message.error("Failed to fetch custom fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFields();
  }, [search, page, sortBy]);

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Custom Field",
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          const data = await deleteCustomField({
            field_id: record._id,
          });

          if (data?.status) {
            message.success(
              data?.message || "Custom Field deleted successfully"
            );

            getAllFields();
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  const onExport = async () => {
    try {
      setExporting(true);
      const { data } = await axiosInstance.post(``, {
        page: 0,
        limit: total,
        search: search,
        sortBy: sortBy,
      });

      if (data?.status) {
        const allOrders = data?.orders;
        const exportData = allOrders?.map((ord) => ({
          orderId: ord?._id,
          name: ord?.name,
          type: ord?.type,
          amount: ord?.orderTotal,
          status: ord?.status,
          paymentMethod: ord?.paymentId?.gateway,
          createdAt: ord?.createdAt,
        }));
        exportToExcel(exportData, `all_Orders_${getCurrentTime()}`);
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
      width: 400,
      render: (type) => {
        switch (type) {
          case 1:
            return "Text";
          case 2:
            return "Number";
          case 3:
            return "Boolean";
          case 4:
            return "Date";
          default:
            return "-";
        }
      },
    },
    {
      title: t("created.at", { defaultValue: "Created At" }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: t("fallback.value", { defaultValue: "Fallback Value" }),
      dataIndex: "fallbackValue",
      key: "fallbackValue",
      render: (value) => value || "N/A",
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
                label: (
                  <Space
                    onClick={() => {
                      handleDelete(record);
                    }}
                  >
                    <Text>
                      {t("delete", {
                        defaultValue: "Delete",
                      })}
                    </Text>
                  </Space>
                ),
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

        </Flex>
      }
    >

      <Space direction="vertical" size="large" style={{ width: "100%" }}>

        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          onFilterClick={() => setShowFilterModal(true)} page="custom-fields"
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onReset={resetFilterParameters}
          searchValue={search}
        />

        <Card bodyStyle={{ padding: 0 }}>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={fields}
            loading={loading}
            pagination={false}
            scroll={{ x: "max-content" }}
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
              label={t("filterbystatus", { defaultValue: "Filter by Status" })}
            >
              <Select
                value={status}
              // onChange={(value) => {
              //     setStatus(value);
              // }}
              >
                <Option value="all">
                  {t("all", { defaultValue: "All" })}
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
