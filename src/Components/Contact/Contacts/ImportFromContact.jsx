import { useEffect, useState } from "react";
import {
    Modal,
    Table,
    Button,
    Input,
    Space,
    Switch,
    Tag,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { getAllContacts } from "./ContactsApi";
import { getAllCustomFields } from "../Custom Field/CustomeFieldApi";
import { t } from "i18next";

function ImportFromContacts({
    open,
    onClose,
    onImport,
}) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
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

    const fetchCustomFields = async () => {
        try {
            const data = await getAllCustomFields({
                page: 0,
                limit: 100,
            });

            if (data?.status) {
                setCustomFields(data.fields || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchContacts();
        }
    }, [open, page, search]);

    useEffect(() => {
        if (open) {
            fetchCustomFields();
        }
    }, [open]);

    // jab modal dubara khulta hai to page/search reset
    useEffect(() => {
        if (open) {
            setPage(1);
            setSearch("");
            setSelectedRowKeys([]);
        }
    }, [open]);

    const handleImport = () => {
        const selected = contacts.filter((item) =>
            selectedRowKeys.includes(item._id)
        );
        onImport(selected);
        setSelectedRowKeys([]);
        onClose();
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
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Phone",
            dataIndex: "phonenumber",
        },
        {
            title: "Email",
            dataIndex: "email",
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
    ];

    return (
        <Modal
            title="Import Contacts"
            open={open}
            width={900}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,

                <Button
                    key="import"
                    type="primary"
                    onClick={handleImport}
                    loading={loading}
                >
                    Import
                </Button>,
            ]}
        >
            <Space
                direction="vertical"
                style={{ width: "100%" }}
            >
                <Input.Search
                    placeholder="Search Contact"
                    enterButton={<SearchOutlined />}
                    allowClear
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                />

                <Table
                    loading={loading}
                    rowKey="_id"
                    columns={columns}
                    dataSource={contacts}
                    scroll={{ x: "max-content", y:300 }}
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