import { useEffect, useState } from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Dropdown, Flex, Form, message, Modal, Select, Space, Switch, Table, Tag } from 'antd'
import { ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import ExcelImport from '../Contacts/ExcelImport'
import ManualImport from '../Contacts/ManualImport'
import AddContact from '../Contacts/AddContact'
import { getCurrentTime } from '../../../util/commom.utils'
import { exportToExcel } from 'react-json-to-excel'
import axiosInstance from '../../../util/axiosInstance'
import { changeContactBlockStatus, deleteContact, getAllContacts } from './ContactsApi'

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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editContact, setEditContact] = useState(null);
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
    };

    const fetchContacts = async () => {
        setLoading(true);

        try {
            const response = await getAllContacts({
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

            if (response?.status) {
                setData(response.contacts || []);
                setTotal(response.total || 0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, [search, page, sortBy]);

    const handleEdit = (record) => {
        setEditContact(record);
        setAddContactOpen(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Delete Contact",
            content: `Are you sure you want to delete ${record.name}?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    const data = await deleteContact({
                        contact_id: record._id,
                    });

                    if (data?.status) {
                        message.success(data?.message || "Conact deleted successfully");
                        fetchContacts();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        });
    };

    const handleBlockStatus = async (record) => {
        try {
            const data = await changeContactBlockStatus({
                contact_id: record._id,
                blocked: !record.blocked,
            });
            if (data?.status) {
                message.success(data?.message || "Contact block status updated");
                fetchContacts();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onExport = async () => {
        try {
            setExporting(true);
            const { data } = await axiosInstance.post(`/api/user/contact/all`, {
                page: 0,
                limit: total,
                search: search,
                sortBy: sortBy,
            });

            if (data?.status) {
                const contacts = data?.contacts || [];
                const exportData = contacts.map((contact) => ({
                    ContactId: contact._id,
                    Name: contact.name,
                    Email: contact.email,
                    Blocked: contact.blocked,
                    Unsubscribe: contact.unsubscribe,
                    CreatedAt: contact.createdAt,
                }));
                exportToExcel(exportData, `all_Contacts_${getCurrentTime()}`);
            } else {
                message.error(data?.message || "Failed to fetch contacts for export");
            }
        } catch (error) {
            console.error("Export Error:", error);
            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred while exporting Contacts"
            );
        } finally {
            setExporting(false);
        }
    };

    const columns = [
        {
            title: t("sn", { defaultValue: "SN" }),
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
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
                record.groups?.length ? (
                    <Space wrap>
                        {record.groups.map((group) => (
                            <Tag key={group._id}>
                                {group.name}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    "-"
                )
            ),
        },
        {
            title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
            dataIndex: "unsubscribe",
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
            title: "Blocked",
            dataIndex: "blocked",
            key: "blocked",
            render: (blocked, record) => (
                <Switch
                    size="large"
                    checked={blocked}
                    onChange={(checked) =>
                        handleBlockStatus(record, checked)
                    }
                />
            ),
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
        },
        // {
        //     title: t("test", { defaultValue: "Test" }),
        //     dataIndex: "test",
        //     key: "test",
        // },
        // {
        //     title: t("country", { defaultValue: "Country" }),
        //     dataIndex: "country",
        //     key: "country",
        // },
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
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "2",
                                label: t("delete", {
                                    defaultValue: "Delete",
                                }),
                                danger: true,
                                onClick: () => handleDelete(record),
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
                            onClose={() => {
                                setAddContactOpen(false);
                                setEditContact(null);
                            }}
                            editData={editContact}
                            fetchContacts={fetchContacts}
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
                        onSearch={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        onReset={resetFilterParameters}
                        searchValue={search}
                    />

                    <Card bodyStyle={{ padding: 0 }}>
                        <Table
                            style={{ padding: 0 }}
                            rowKey="_id"
                            columns={columns}
                            dataSource={data}
                            loading={loading}
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
