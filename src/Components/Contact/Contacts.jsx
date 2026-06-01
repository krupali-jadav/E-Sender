import React, { useState } from 'react'
import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Space, Table, Tag } from 'antd'
import { ImportOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import ManualImport from './ManualImport'
const columns = [
    {
        // title: t("sn", { defaultValue: "SN" }),
        title: "SN",
        dataIndex: "sn",
        key: "sn",
    },
    {
        // title: t("name", { defaultValue: "Name" }),
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        // title: t("phone", { defaultValue: "Phone" }),
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
    },
    {
        // title: t("email", { defaultValue: "Email" }),
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        // title: t("company", { defaultValue: "Company" }),
        title:"Company",
        dataIndex: "company",
        key: "company",
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
        // title: t("created_at", { defaultValue: "Created At" }),
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
    },
    {
        // title: t("actions", { defaultValue: "Actions" }),
        title: "Actions",
        key: "actions",
        render: () => (
            <Space>
                <Button size="small" type="primary">
                    Edit
                </Button>
                <Button size="small" danger>
                    Delete
                </Button>
            </Space>
        ),
    },
];

function Contacts() {

    const [open, setOpen] = useState(false);
    return (
        <>
            <PageContainer
                title="Contacts"
                breadcrumb={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<ImportOutlined />}
                            onClick={() => setOpen(true)}
                        >
                            Manual Import
                        </Button>

                        <ManualImport
                            open={open}
                            onClose={() => setOpen(false)}
                        />

                        <Button type="primary" icon={<ImportOutlined />}>
                            Excel Import
                        </Button>

                        <Button type="primary"  icon={<PlusOutlined />}>
                            Add Contact
                        </Button>
                    </Space>
                }
            >
                {/* <Space type="vertical" size="large" style={{ width: "100%" }}> */}

                <SearchHeader />

                <Card>
                    <Table
                        columns={columns}
                        // dataSource={data}
                        pagination={false}
                    />
                </Card>
                {/* </Space> */}
            </PageContainer>
        </>
    )
}

export default Contacts
