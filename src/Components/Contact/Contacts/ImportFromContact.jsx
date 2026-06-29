import { useEffect, useState } from "react";
import {
    Modal,
    Table,
    Button,
    Input,
    Space,
    Switch,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { getAllContacts } from "./ContactsApi";
import { t } from "i18next";

function ImportFromContacts({
    open,
    onClose,
    onImport,
}) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchContacts = async () => {
        setLoading(true);

        const data = await getAllContacts({
            page: 0,
            limit: 100,
            search: "",
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
        }

        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            fetchContacts();
        }
    }, [open]);

    const handleImport = () => {
        console.log("Selected Row Keys:", selectedRowKeys);
        console.log("Contacts:", contacts);
        const selected = contacts.filter((item) =>
            selectedRowKeys.includes(item._id)
        );
        console.log("Import", selected)
        onImport(selected);
        setSelectedRowKeys([]);
        onClose();
    };

    const columns = [
        {
            title: t("sn", { defaultValue: "SN" }),
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
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
                />

                <Table
                    loading={loading}
                    rowKey="_id"
                    columns={columns}
                    dataSource={contacts}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys, rows) => {
                            console.log("Keys:", keys);
                            console.log("Rows:", rows);
                            setSelectedRowKeys(keys);
                        },
                    }}
                />
            </Space>
        </Modal>
    );
}

export default ImportFromContacts;