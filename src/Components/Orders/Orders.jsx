import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Card, message, Space, Table, Tag } from 'antd'
import { Link } from 'react-router-dom';
import axiosInstance from '../../util/axiosInstance';
import { exportToExcel } from "react-json-to-excel";
import { useEffect, useState } from 'react';
import { getCurrentTime } from '../../util/commom.utils';
// import { t } from 'i18next'
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

    const [exporting, setExporting] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("created-at");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    //pagination
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isApplyFilter, setIsApplyFilter] = useState(false);

    const getAllOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post("order/telecaller-admin/all", {
                page: page - 1,
                limit: pageSize,
                search: search,
                sort_by: sortBy,
                filter_by: isApplyFilter
                    ? {
                        date_type: filterType,
                        date: {
                            start_date: startDate ? startDate.format("YYYY-MM-DD") : null,
                            end_date: endDate ? endDate.format("YYYY-MM-DD") : null,
                        },
                        status: status,
                    }
                    : null,
            });
            if (data.status) {
                setOrders(data?.orders);
                setTotal(data?.total);
            } else {
                message.error(data?.message || "Failed to load orders");
            }
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    
    // useEffect(() => {
    //     getAllOrders();
    // }, [debounce, dispatch, page, pageSize, isApplyFilter, sortBy]);

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
                message.error(data?.message || "Failed to fetch orders for export");
            }
        } catch (error) {
            message.error("An error occurred while exporting orders");
        } finally {
            setExporting(false);
        }
    };

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
                <Link to={`/orders/${record._id}`}>#{record._id}</Link>
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

    return (
        <>
            <PageContainer
                title="Orders"
                breadcrumb={false}

            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>

                    <SearchHeader  />

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
