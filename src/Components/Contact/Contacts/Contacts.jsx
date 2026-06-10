import { useState } from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Flex, Form, message, Modal, Select, Space, Switch, Table, Tag } from 'antd'
import { ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import ExcelImport from '../Contacts/ExcelImport'
import ManualImport from '../Contacts/ManualImport'
import AddContact from '../Contacts/AddContact'
import { getCurrentTime } from '../../../util/commom.utils'
import { exportToExcel } from 'react-json-to-excel'
import axiosInstance from '../../../util/axiosInstance'

function Contacts() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("created-at");
    const [exporting, setExporting] = useState(false);
    const [excelOpen, setExcelOpen] = useState(false);
    const [manualImportOpen, setManualImportOpen] = useState(false);
    const [AddContactOpen, setAddContactOpen] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterType, setFilterType] = useState("all-time");
    const [status, setStatus] = useState("All");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterForm] = Form.useForm();
    const resetFilterParameters = () => {
        setStatus("all");
        setPage(1);
        setSearch("");
        setIsApplyFilter(false);
        setFilterType("all-time");
        setStartDate(null);
        setEndDate(null);
        setStatus("all");
        setShowFilterModal(false);
        filterForm.resetFields();
    };

    const [data, setData] = useState([
        {
            key: "1",
            sn: "1",
            name: "John Doe",
            phonenumber: "+1234567890",
            email: "test@gmail.com",
            groups: "Group 1",
            unsubscribed: "No",
            spam: "No",
            blocked: false,
            createdAt: "2024-01-01",
            test: "Test 1",
            country: "USA",
        },
    ]);
    const handleBlockedChange = (checked, record) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? { ...item, blocked: checked }
                    : item
            )
        );
    }

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
                message.error(data?.message || "Failed to fetch contacts for export");
            }
        } catch (error) {
            message.error("An error occurred while exporting Contacts", error);
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
            title: t("phonenumber", { defaultValue: "Phone Number" }),
            dataIndex: "phonenumber",
            key: "phonenumber",
        },
        {
            title: t("email", { defaultValue: "Email" }),
            dataIndex: "email",
            key: "email",
        },
        {
            title: t("groups", { defaultValue: "Groups" }),
            dataIndex: "groups",
            key: "groups",
            render: (_, record) => (
                record.groups ? (
                    <Tag>{record.groups}</Tag>
                ) : (
                    "-"
                )),
        },
        {
            title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
            dataIndex: "unsubscribed",
            key: "unsubscribed",
            render: (_, record) => (
                record.unsubscribed ? (
                    <Tag>{record.unsubscribed}  </Tag>
                ) : (
                    "-"
                )),
        },
        {
            title: t("spam", { defaultValue: "Spam" }),
            dataIndex: "spam",
            key: "spam",
            render: (_, record) => (
                record.spam ? (
                    <Tag>{record.spam}  </Tag>
                ) : (
                    "-"
                )),
        },
        {
            title: t("blocked", { defaultValue: "Blocked" }),
            dataIndex: "blocked",
            key: "blocked",
            render: (_, record) => (
                <Switch
                    checked={record.blocked}
                    onChange={(checked) =>
                        handleBlockedChange(checked, record)
                    }
                />
            ),
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: t("test", { defaultValue: "Test" }),
            dataIndex: "test",
            key: "test",
        },
        {
            title: t("country", { defaultValue: "Country" }),
            dataIndex: "country",
            key: "country",
        },
        {
            title: t("actions", { defaultValue: "Actions" }),
            key: "actions",
            render: () => (
                <MoreOutlined />
                // <Space>

                //     <Button size="small" type="primary">
                //         Edit
                //     </Button>
                //     <Button size="small" danger>
                //         Delete
                //     </Button>
                // </Space>
            ),
        },
    ];

    return (
        <>
            <PageContainer
                title="Contacts"
                breadcrumb={false}
                extra={
                    <Flex gap="small" justify="flex-end" wrap>
                        <Button
                            type="primary"
                            icon={<ImportOutlined />}
                            onClick={() => setManualImportOpen(true)}
                        >
                            {t("manual.import", { defaultValue: "Manual Import" })}
                        </Button>

                        <ManualImport
                            open={manualImportOpen}
                            onClose={() => setManualImportOpen(false)}
                        />

                        <Button
                            type="primary"
                            icon={<ImportOutlined />}
                            onClick={() => setExcelOpen(true)}
                        >
                            {t("excel.import", { defaultValue: "Excel Import" })}
                        </Button>

                        <ExcelImport
                            open={excelOpen}
                            onClose={() => setExcelOpen(false)}
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setAddContactOpen(true)}
                        >
                            {t("add.contact", { defaultValue: "Add Contact" })}
                        </Button>

                        <AddContact
                            open={AddContactOpen}
                            onClose={() => setAddContactOpen(false)}
                        />
                    </Flex>
                }
            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>

                    <SearchHeader
                        onExport={onExport}
                        exporting={exporting}
                        onFilterClick={() => { setShowFilterModal(true); }}
                        page="contacts"
                        onExport={onExport}
                        exporting={exporting}
                    />

                    <Card bodyStyle={{ padding: 0 }}>
                        <Table
                            style={{ padding: 0 }}
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>

                    <Modal
                        title={t("filter.contacts", { defaultValue: "Filter Contacts" })}
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
                                label={t("filter.by.groups", { defaultValue: "Filter by Groups" })}
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

                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("filter.by.blocked", { defaultValue: "Filter by Blocked" })}
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
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("filter.by.unsubscribed", { defaultValue: "Filter by Unsubscribed" })}
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
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Space>
            </PageContainer>
        </>
    )
}

export default Contacts
