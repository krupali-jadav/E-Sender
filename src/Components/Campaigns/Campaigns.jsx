import { PageContainer } from '@ant-design/pro-components'
import SearchHeader from '../../Components/Search Header/SearchHeader'
import { Button, Card, message, Space, Table } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import { getCurrentTime } from '../../util/commom.utils';
import axiosInstance from '../../util/axiosInstance';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';


function Campaigns() {
  const navigate = useNavigate();
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
  const columns = [
    {
      title: t("sn", { defaultValue: "SN" }),
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("total.Contacts", { defaultValue: "Total Contacts" }),
      dataIndex: "totalContacts",
      key: "totalContacts",
    },
    {
      title: t("blocked", { defaultValue: "Blocked" }),
      dataIndex: "blocked",
      key: "blocked",
    },
    {
      title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
      dataIndex: "unsubscribed",
      key: "unsubscribed",
    },
    {
      title: t("created.at", { defaultValue: "Created At" }),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("actions", { defaultValue: "Actions" }),
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
  return (
    <PageContainer
      title="Campaigns"
      breadcrumb={false}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/campaigns/create-campaign")}
          >
            {t("add.campaigns", { defaultValue: "Add Campaigns" })}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <SearchHeader
          onExport={onExport}
          exporting={exporting}
          page="groups" />

        <Card styles={{ body: { padding: "0" } }}>
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

export default Campaigns
