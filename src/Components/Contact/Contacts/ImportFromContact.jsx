import { useEffect, useState } from "react";
import {
    Modal,
    Table,
    Button,
    Input,
    Space,
    Switch,
    Tag,
    Form,
    Select,
    Flex,
    Row,
    message,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { getAllContacts } from "./ContactsApi";
import { getAllCustomFields } from "../Custom Field/CustomeFieldApi";
import { t } from "i18next";
import { getAllGroups } from "../Group/GroupApi";

function ImportFromContacts({ open, onClose, onImport, }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [groups, setGroups] = useState([]);
    const [groupIds, setGroupIds] = useState([]);
    const pageSize = 10;

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await getAllContacts({
                page: page - 1,
                limit: pageSize,
                search: search,
                sort_by: "created-at",
                filter_by: {
                    date_type: "all",
                    date: {
                        start_date: null,
                        end_date: null,
                    },
                    group_ids: groupIds,
                },
            });
            if (data?.status) {
                setContacts(data.contacts || []);
                setTotal(data.total || 0);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open) {
            fetchContacts();
        }
    }, [open, page, search, groupIds]);

    const fetchGroups = async () => {
        try {
            const response = await getAllGroups({
                page: 0,
                search: search,
            });
            if (response?.status) {
                setGroups(response.groups || []);
            }
        } catch (error) {
            console.log(error);
            message.error(response?.message || "Failed to fetch groups");
        }
    };
    useEffect(() => {
        if (open) {
            fetchGroups();
        }
    }, [open]);

    const fetchCustomFields = async () => {
        try {
            const data = await getAllCustomFields({
                page: 0,
                limit: 10,
            });
            if (data?.status) {
                setCustomFields(data.fields || []);
            }
        } catch (error) {
            console.log(error);
            message.error(data?.message || "Failed to fetch custom fields");
        }
    };
    useEffect(() => {
        if (open) {
            fetchCustomFields();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setPage(1);
            setSearch("");
            setSelectedRowKeys([]);
        }
    }, [open]);

    const handleImport = async () => {
        setLoading(true);
        try {
            const selected = contacts.filter((item) =>
                selectedRowKeys.includes(item._id)
            );
            onImport(selected);
            setSelectedRowKeys([]);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleBlockStatus = (record, checked) => {
        setContacts((prev) =>
            prev.map((c) =>
                c._id === record._id ? { ...c, blocked: checked } : c
            )
        );
    };

    const customFieldColumns = customFields
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
            width: 60,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: t("name", { defaultValue: "Name" }),
            dataIndex: "name",
        },
        {
            title: t("email", { defaultValue: "Email" }),
            dataIndex: "email",
        },
        {
            title: t("phone_number", { defaultValue: "Phone Number" }),
            dataIndex: "phonenumber",
        },
        {
            title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
            dataIndex: "unsubscribe",
            key: "unsubscribed",
            render: (_, record) => (
                record.unsubscribed ? (
                    <Tag>{record.unsubscribed}</Tag>
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
                    <Tag>{record.spam}</Tag>
                ) : (
                    "-"
                )),
        },
        {
            title: t("blocked", { defaultValue: "Blocked" }),
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
    ];

    return (
        <Modal
            title={t("import.contacts", { defaultValue: "Import Contacts" })}
            open={open}
            width={900}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,

                <Button
                    key="import"
                    type="primary"
                    onClick={handleImport}
                >
                    {t("import", { defaultValue: "Import" })}
                </Button>,
            ]}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Input.Search
                        style={{ width: 350 }}
                        placeholder={t("search_contacts", { defaultValue: "Search Contacts" })}
                        enterButton={<SearchOutlined />}
                        allowClear
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                    />

                    <Form.Item label={t("filter_by_groups", { defaultValue: "Filter by Groups" })} style={{ marginBottom: 0 }} >
                        <Select
                            mode="multiple"
                            showSearch
                            style={{ width: 300 }}
                            optionFilterProp="label"
                            value={groupIds}
                            onChange={(value) => {
                                setGroupIds(value);
                                setPage(1);
                            }}
                            placeholder={t("filter_by_groups", { defaultValue: "Filter by Groups" })}
                            options={groups.map((group) => ({
                                label: group.name,
                                value: group._id,
                            }))}
                        />
                    </Form.Item>
                </Row>

                <Table
                    loading={loading}
                    rowKey="_id"
                    columns={columns}
                    dataSource={contacts}
                    scroll={{ x: "max-content", y: 300 }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys, rows) => {
                            setSelectedRowKeys(keys);
                        },
                    }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: false,
                        onChange: (newPage) => {
                            setPage(newPage);
                        },
                    }}
                />
            </Space>
        </Modal>
    );
}

export default ImportFromContacts;