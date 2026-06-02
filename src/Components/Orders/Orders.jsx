import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import {  Card, Space, Table, Tag } from 'antd'
import { Link } from 'react-router-dom';
// import { t } from 'i18next'

const columns = [
    {
        // title: t("sn", { defaultValue: "SN" }),
        title: "S/N",
        dataIndex: "sn",
         width: 100,
        key: "sn",
    },
    {
        // title: t("order_id", { defaultValue: "Order ID" }),
        title: "Order ID",
        dataIndex: "orderId",
         width: 150,
        key: "orderId",
        render: (_, record) => (
        <Link to={`/order/${record._id}`}>#{record._id}</Link>
      ),
    },
    {
        // title: t("type", { defaultValue: "Type" }),
        title: "Type",
        dataIndex: "type",
        key: "type",
    },
    {
        // title: t("status", { defaultValue: "Status" }),
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Tag color={status === "Active" ? "green" : "red"}>
                {status}
            </Tag>
        ),
    },
    {
        // title: t("payment", { defaultValue: "Payment" }),
        title: "Payment",
        dataIndex: "payment",
        key: "payment",
         render: (payment) => (
            <Tag color={payment === "Paid" ? "green" : "red"}>
                {payment}
            </Tag>
        ),
    },
    {
        // title: t("amount", { defaultValue: "Amount" }),
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
    },
    {
        // title: t("payment_method", { defaultValue: "Payment Method" }),
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
    },

    {
        // title: t("created_at", { defaultValue: "Created At" }),
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
    },
    
];

const data = [
    {
        key: "1",
        sn: 1,
        _id: "6a156b0d835de518302af134",
        // type: "Subscription",
        // status: "Active",
        // payment: "Paid",
        // amount: "₹999",
        // paymentMethod: "UPI",
        // createdAt: "02-06-2026 12:00 PM",
    },
];

function Orders() {
    return (
        <>
            <PageContainer
                title="Orders"
                breadcrumb={false}

            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>

                    <SearchHeader />

                    <Card >
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </Space>
            </PageContainer>
        </>
    )
}

export default Orders
