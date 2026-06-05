import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../Search Header/SearchHeader'
import { Button, Card, Empty, message, Space, Spin, Table, Tag } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import AddGroup from './AddGroup';
import { useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import { getCurrentTime } from '../../../util/commom.utils';
import axiosInstance from '../../../util/axiosInstance';

const columns = [
  {
    // title: t("sn", { defaultValue: "SN" }),
    title: "SN",
    dataIndex: "sn",
    key: "sn",
    width: 20,
  },
  {
    // title: t("name", { defaultValue: "Name" }),
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    // title: t("totalContacts", { defaultValue: "Total Contacts" }),
    title: "Total Contacts",
    dataIndex: "totalContacts",
    key: "totalContacts",
    width: 250,
  },
  {
    // title: t("blocked", { defaultValue: "Blocked" }),
    title: "Blocked",
    dataIndex: "blocked",
    key: "blocked",
    width: 250,
  },
  {
    // title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
    title: "Unsubscribed",
    dataIndex: "unsubscribed",
    key: "unsubscribed",
    width: 250,
  },
  {
    // title: t("created_at", { defaultValue: "Created At" }),
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 250,
  },
  {
    // title: t("actions", { defaultValue: "Actions" }),
    title: "Actions",
    key: "actions",
    width: 250,
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
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created-at");
  const [total, setTotal] = useState(0);

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
        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          page="groups" />

        <Card bodyStyle={{padding:0}}>
          <Table
            columns={columns}
            // dataSource={data}
            pagination={true}
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No Data Found"
                />
              ),
            }}
          />
        </Card>
      </Space>
    </PageContainer>
  )
}

export default Groups
