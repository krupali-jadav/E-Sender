import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Card, DatePicker, Form, Modal, Radio, Select, Space, Table, Tag } from 'antd'
import { useState } from 'react';
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

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterType, setFilterType] = useState("all-time");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterForm] = Form.useForm();
    const resetFilterParameters = () => {
        setFilterType("all-time");
        setStartDate(null);
        setEndDate(null);
        setStatus("all");
        setShowFilterModal(false);
        filterForm.resetFields();
    };

    const OrderStatuses = [
        // t("processing", { defaultValue: "Processing" }),
        "Processing",
        // t("pending", { defaultValue: "Pending" }),
        "Pending",
        // t("failed", { defaultValue: "Failed" }),
        'Failed',
        // t("on.hold", { defaultValue: "On Hold" }),
        "On Hold",
        // t("completed", { defaultValue: "Completed" }),
        "Completed",
        // t("cancelled", { defaultValue: "Cancelled" }),
        "Cancelled",
        // t("refunded", { defaultValue: "Refunded" }),
        "Refunded",
        // t("draft", { defaultValue: "Draft" }),
        "Draft",
    ];

    return (
        <>
            <PageContainer
                title="Orders"
                breadcrumb={false}

            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>

                    <SearchHeader
                        onFilterClick={() => setShowFilterModal(true)}
                        page="orders"
                    />

                    <Card >
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>

                    <Modal
                        // title={t("filter.orders", { defaultValue: "Filter Orders" })}
                        title="Filter Orders"
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
                            <Form.Item>
                                <Radio.Group
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <Radio value={"all-time"}>
                                        {/* {t("allTime", { defaultValue: "All Time" })} */}
                                        All Time
                                    </Radio>
                                    <Radio value={"specific"}>
                                        {/* {t("specificTime", { defaultValue: "Specific Time" })} */}
                                        Specific Time
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>

                            {filterType == "specific" && (
                                <Form.Item
                                    // label={t("filterbydate", { defaultValue: "Filter by Date" })}
                                    label="Filter by Date"
                                    name="date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("please.select.date", {
                                                defaultValue: "Please select a date",
                                            }),
                                        },
                                    ]}
                                >
                                    <RangePicker
                                        placeholder={[
                                            // t("start.date", { defaultValue: "Start Date" }),
                                            "Start Date",
                                            // t("end.date", { defaultValue: "End Date" }),
                                            "End Date"
                                        ]}
                                        maxDate={dayjs()}
                                        style={{
                                            width: "100%",
                                        }}
                                    // onChange={(dates) => {
                                    //     const [start, end] = dates;
                                    //     setStartDate(start);
                                    //     setEndDate(end);
                                    // }}
                                    />
                                </Form.Item>
                            )}

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
            </PageContainer>
        </>
    )
}

export default Orders
