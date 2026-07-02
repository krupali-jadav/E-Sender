import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../../Components/Search Header/SearchHeader'
import { Button, Card, DatePicker, Dropdown, Form, message, Modal, Space, Table } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import AddGroup from './AddGroup';
import { formatDate, getCurrentTime } from '../../../util/commom.utils'
import { useEffect, useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import axiosInstance from '../../../util/axiosInstance';
import { t } from 'i18next';
import { deleteGroup, deleteMultipleGroups, getAllGroups } from './GroupApi';
const { RangePicker } = DatePicker;

function Groups() {
  const [AddGroupOpen, setAddGroupOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Sort by Created At");
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const resetFilterParameters = () => {
    setStatus("all");
    setPage(1);
    setSearch("");
    setSortBy("created-at");
    setIsApplyFilter(false);
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setStatus("all");
    setShowFilterModal(false);
    filterForm.resetFields();
    setSortBy(null);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const onExport = async () => {
    try {
      setExporting(true);
      const { data } = await axiosInstance.post(`/api/user/group/all`, {
        page: 0,
        limit: total,
        search: search,
        sortBy: sortBy,
      });

      if (data?.status) {
        const groups = data?.groups;
        const exportData = groups?.map((group) => ({
          GroupId: group?._id,
          Name: group?.name,
          TotalContacts: group?.totalContacts,
          Block: group?.blockedContacts,
          Unsubscribed: group?.unsubscribeContacts,
          createdAt: group?.createdAt,
        }));
        exportToExcel(exportData, `all_Groups_${getCurrentTime()}`);
      } else {
        message.error(data?.message || "Failed to fetch groups for export");
      }
    } catch (error) {
      message.error("An error occurred while exporting Groups", error);
    } finally {
      setExporting(false);
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getAllGroups({
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
          }
          : null,
      });
      if (data?.status) {
        setGroups(data.groups || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, page, sortBy, isApplyFilter, startDate, endDate]);

  const openEditModal = (record) => {
    setEditingGroup(record);
    setAddGroupOpen(true);
  };

  const handleDeleteGroups = (ids, name = "") => {
    Modal.confirm({
      title: ids.length > 1 ? "Delete Groups" : "Delete Group",
      content:
        ids.length > 1
          ? `Are you sure you want to delete ${ids.length} groups?`
          : `Are you sure you want to delete "${name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          let data;

          if (ids.length === 1) {
            data = await deleteGroup({
              group_id: ids[0],
            });
          } else {
            data = await deleteMultipleGroups({
              group_ids: ids,
            });
          }

          if (data?.status) {
            message.success(
              data?.message || "Group(s) deleted successfully"
            );

            setSelectedRowKeys([]);
            fetchGroups();
          }
        } catch (error) {
          console.log(error);
          message.error(error?.message || "Failed to delete group(s)");
        }
      },
    });
  };

  const columns = [
    {
      title: t("sn", { defaultValue: "SN" }),
      dataIndex: "sn",
      key: "sn",
      width: 20,
      render: (_, __, index) => index + 1,
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: t("total.contacts", { defaultValue: "Total Contacts" }),
      dataIndex: "totalContacts",
      key: "totalContacts",
      width: 250,
    },
    {
      title: t("blocked", { defaultValue: "Blocked" }),
      dataIndex: "blockedContacts",
      key: "blockedContacts",
    },
    {
      title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
      dataIndex: "unsubscribeContacts",
      key: "unsubscribeContacts",
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
                  handleDeleteGroups([record._id], record.name),
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
      title="Groups"
      breadcrumb={false}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddGroupOpen(true)}
          >
            {t("add.group", { defaultValue: "Add Group" })}
          </Button>

          <AddGroup
            open={AddGroupOpen}
            onClose={() => {
              setAddGroupOpen(false);
              setEditingGroup(null);
            }}
            editData={editingGroup}
            fetchGroups={fetchGroups}
          />

          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleDeleteGroups(selectedRowKeys)}
          >
            Delete Selected
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          onFilterClick={() => setShowFilterModal(true)}
          page="groups"
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
            dataSource={groups}
            loading={loading}
            pagination={{
              current: page,
              pageSize: 10,
              total: total,
              showSizeChanger: false,
              onChange: (newPage) => {
                setPage(newPage);
              },
            }}
            scroll={{ x: "max-content",y:500 }}
            rowSelection={rowSelection}
          />
        </Card>

        <Modal
          title={t("filter.groups", { defaultValue: "Filter Groups" })}
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
          </Form>
        </Modal>
      </Space>
    </PageContainer>
  )
}

export default Groups