import React from 'react'
import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Space, Table, Tag } from 'antd'
import {  ImportOutlined, PlusOutlined } from '@ant-design/icons'
const columns = [
    {
        title: "SN",
        dataIndex: "sn",
        key: "sn",
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Company",
        dataIndex: "company",
        key: "company",
    },
    {
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
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
    },
    {
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
    return (
        <>
            <PageContainer
                title="Contacts"
                breadcrumb={false}
                extra={
                    <Space>
                        <Button type="primary" icon={<ImportOutlined />}>
                            Manual Import
                        </Button>

                        <Button type="primary" icon={<ImportOutlined />}>
                            Excel Import
                        </Button>

                        <Button type="primary" icon={<PlusOutlined />}>
                            Add Contact
                        </Button>
                    </Space>
                }
            >

                <SearchHeader />

                <Card>
                    <Table
                        columns={columns}
                        // dataSource={data}
                        pagination={false}
                    />
                </Card>
            </PageContainer>
        </>
    )
}

export default Contacts
