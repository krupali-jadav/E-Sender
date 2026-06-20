import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../../Components/Search Header/SearchHeader'
import { Button, Card, Dropdown, Form, message, Modal, Space, Table } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import AddGroup from './AddGroup';
import { useEffect, useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import { getCurrentTime } from '../../../util/commom.utils';
import axiosInstance from '../../../util/axiosInstance';
import { t } from 'i18next';
import { deleteGroup, getAllGroups } from './GroupApi';

function Groups() {
  const [AddGroupOpen, setAddGroupOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created-at");
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const resetFilterParameters = () => {
    setStatus("all");
    setPage(1);
    setSearch("");
    setSortBy("created-at");
    // setIsApplyFilter(false);
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setStatus("all");
    setShowFilterModal(false);
    filterForm.resetFields();
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
        filter_by: {
          date_type: "all",
          date: {
            start_date: null,
            end_date: null,
          },
        },
      });
      if (data?.status) {
        setGroups(data.groups || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, page, sortBy]);

  const openEditModal = (record) => {
    setEditingGroup(record);
    setAddGroupOpen(true);
  };

  const handleDeleteGroup = (record) => {
    Modal.confirm({
      title: "Delete Group",
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          const data = await deleteGroup({
            group_id: record._id,
          });

          if (data?.status) {
            message.success(
              data?.message || "Group deleted successfully"
            );

            fetchGroups();
          }
        } catch (error) {
          console.log(error);
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
      render: (date) => getCurrentTime(date), // or formatDate(date)
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
                onClick: () => handleDeleteGroup(record),
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
        </Space>
      }
    >
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <SearchHeader
          onExport={onExport}
          exporting={exporting}
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
            pagination={false}
            scroll={{ x: "max-content" }}

          />
        </Card>
      </Space>
    </PageContainer>
  )
}

export default Groups
