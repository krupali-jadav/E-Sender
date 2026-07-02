import { useEffect, useState } from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import {  Button, Card,  DatePicker, Dropdown, Flex, Form, message, Modal, Popover, Row, Select, Space, Switch, Table, Tag } from 'antd'
import { ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import { formatDate, getCurrentTime } from '../../../util/commom.utils';
import ExcelImport from '../Contacts/ExcelImport'
import ManualImport from '../Contacts/ManualImport'
import AddContact from '../Contacts/AddContact'
import { exportToExcel } from 'react-json-to-excel'
import axiosInstance from '../../../util/axiosInstance'
import { changeContactBlockStatus, deleteContact, deleteMultipleContacts, getAllContacts } from './ContactsApi'
import { getAllGroups } from '../Group/GroupApi'

function Contacts({ showGroups }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("Sort by Created At");
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
    const [isApplyFilter, setIsApplyFilter] = useState(false);
    const [blocked, setBlocked] = useState("all");
    const [unsubscribe, setUnsubscribe] = useState("all");
    const [groupIds, setGroupIds] = useState([]);
    const [groups, setGroups] = useState([]);
    const { RangePicker } = DatePicker;
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

    const fetchContacts = async () => {
        const payload = {
            page: page - 1,
            limit: 20,
            search: search,
            sort_by: sortBy,
            filter_by: isApplyFilter
                ? {
                    date_type: startDate && endDate ? "specific" : "all",
                    date: {
                        start_date: startDate ? startDate.startOf("day").toISOString() : null,
                        end_date: endDate ? endDate.endOf("day").toISOString() : null,
                    },
                    blocked: blocked !== "all" ? blocked : "all",
                    unsubscribe: unsubscribe !== "all" ? unsubscribe : "all",
                    type: "all",
                    group_ids: groupIds,
                }
                : null,
        };
        try {
            setLoading(true);
            const response = await getAllContacts(payload);

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
    }, [search, page, sortBy, isApplyFilter, blocked, unsubscribe, groupIds,]);

    const fetchGroups = async () => {
        try {
            const response = await getAllGroups({
                page: 0,
                // limit: 10,
                search: "",
            });

            if (response?.status) {
                console.log("Groups:", response);
                setGroups(response.groups || []);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchGroups();
    }, []);

    const handleEdit = (record) => {
        setEditContact(record);
        setAddContactOpen(true);
    };

    const handleDeleteContacts = (ids, name = "") => {
        Modal.confirm({
            title: ids.length > 1 ? "Delete Contacts" : "Delete Contact",
            content:
                ids.length > 1
                    ? `Are you sure you want to delete ${ids.length} contacts?`
                    : `Are you sure you want to delete "${name}"?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    let data;

                    if (ids.length === 1) {
                        data = await deleteContact({
                            contact_id: ids[0],
                        });
                    } else {
                        data = await deleteMultipleContacts({
                            contact_ids: ids,
                        });
                    }

                    if (data?.status) {
                        message.success(
                            data?.message || "Contact(s) deleted successfully"
                        );

                        setSelectedRowKeys([]);
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
            message.error("An error occurred while exporting Fields", error);
        } finally {
            setExporting(false);
        }
    };

    // For Dynamic Custome Field 
    const uniqueFields = [
        ...new Map(
            data
                .flatMap((contact) => contact.fields || [])
                .filter((field) => field?.fieldId && field.fieldId._id)
                .map((field) => [
                    field.fieldId._id,
                    field.fieldId,
                ])
        ).values(),
    ];

    const customFieldColumns = uniqueFields
        .filter((field) => field && field.name)
        .map((field) => ({
            title: field.name,
            dataIndex: field._id,
            key: field._id,

            render: (_, record) => {
                const fieldData = record.fields?.find(
                    (f) => (f.fieldId?._id || f.fieldId) === field._id
                );

                return fieldData?.value || "-";
            },
        }));

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
            render: (_, record) => {
                if (!record.groups?.length) return "-";
                return (
                    <Space wrap>
                        {record.groups.slice(0, 2).map((group) => (
                            <Tag key={group._id}>
                                {group.name}
                            </Tag>
                        ))}
                        {record.groups.length > 2 && (
                            <Popover
                                placement="bottomLeft"
                                trigger="hover"
                                content={
                                    <Space direction="vertical">
                                        {record.groups.slice(2).map((group) => (
                                            <Tag key={group._id}>
                                                {group.name}
                                            </Tag>
                                        ))}
                                    </Space>
                                }
                            >
                                <Tag style={{ cursor: "pointer" }}>
                                    +{record.groups.length - 2}
                                </Tag>
                            </Popover>
                        )}
                    </Space>
                );
            },
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
        ...customFieldColumns,
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
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "2",
                                label: t("delete", {
                                    defaultValue: "Delete",
                                }),
                                danger: true,
                                onClick: () =>
                                    handleDeleteContacts([record._id], record.name),
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
                            fetchContacts={fetchContacts}
                            showGroups={true}
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
                            onClick={() => {
                                setEditContact(null);
                                setAddContactOpen(true);
                            }}
                        >
                            Add Contact
                        </Button>

                        <AddContact
                            open={AddContactOpen}
                            onClose={() => {
                                setAddContactOpen(false);
                                setEditContact(null);
                            }}
                            editData={editContact}
                            fetchContacts={fetchContacts}
                            showGroups={true}
                        />
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => handleDeleteContacts(selectedRowKeys)}
                        >
                            Delete Selected
                        </Button>
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
                        sortBy={sortBy}
                        onSortChange={(value) => {
                            setSortBy(value);
                            setPage(1);
                        }}
                    />

                    <Card styles={{ body: { padding: 0 } }}>
                        <Table
                            style={{ padding: 0 }}
                            rowKey="_id"
                            columns={columns}
                            dataSource={data}
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
                            scroll={{ x: "max-content", y: 500 }}
                            rowSelection={rowSelection}
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
                                    value={
                                        startDate && endDate
                                            ? [startDate, endDate]
                                            : null
                                    }
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
                            <Form.Item
                                label={t("filter.by.groups", { defaultValue: "Filter by Groups" })}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    optionFilterProp="label"
                                    value={groupIds}
                                    onChange={(value) => setGroupIds(value)}
                                    placeholder="Select Groups"
                                    options={groups.map((group) => ({
                                        label: group.name,
                                        value: group._id,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("filter.by.blocked", { defaultValue: "Filter by Blocked" })}
                            >
                                <Select
                                    value={blocked}
                                    onChange={(value) => setBlocked(value)}
                                >
                                    <Select.Option value="all">All</Select.Option>
                                    <Select.Option value="true">Blocked</Select.Option>
                                    <Select.Option value="false">Unblocked</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("filter.by.unsubscribed", { defaultValue: "Filter by Unsubscribed" })}
                            >
                                <Select
                                    value={unsubscribe}
                                    onChange={(value) => setUnsubscribe(value)}
                                >
                                    <Select.Option value="all">All</Select.Option>
                                    <Select.Option value="true">Subscribed</Select.Option>
                                    <Select.Option value="false">Unsubscribed</Select.Option>
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