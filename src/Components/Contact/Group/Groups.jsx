import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../Search Header/SearchHeader'
import { Button, Card, Dropdown, Empty, message, Modal, Space, Table, Typography } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import AddGroup from './AddGroup';
import { useEffect, useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import { getCurrentTime } from '../../../util/commom.utils';
import axiosInstance from '../../../util/axiosInstance';
import { t } from 'i18next';
import { deleteGroup, getAllGroups } from './GroupApi';
const { Title, Text } = Typography;

function Groups() {
  const [AddGroupOpen, setAddGroupOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created-at");
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

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
        page: 0,
        limit: 10,
        search: "",
        sort_by: "created-at",
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
  }, []);

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
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          page="groups" />

        <Card bodyStyle={{ padding: 0 }}>
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
