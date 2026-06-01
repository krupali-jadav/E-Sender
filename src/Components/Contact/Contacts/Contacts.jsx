import React, { useState } from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Space, Table, Tag } from 'antd'
import { ImportOutlined, PlusOutlined } from '@ant-design/icons'
import ManualImport from '../Contacts/ManualImport'
import AddContact from '../Contacts/AddContact'
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

    const [manualImportOpen, setManualImportOpen] = useState(false);
    const [AddContactOpen, setAddContactOpen] = useState(false);
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
                            onClick={() => setManualImportOpen(true)}
                        >
                            Manual Import
                        </Button>

                        <ManualImport
                            open={manualImportOpen}
                            onClose={() => setManualImportOpen(false)}
                        />

                        <Button type="primary" icon={<ImportOutlined />}>
                            Excel Import
                        </Button>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setAddContactOpen(true)}
                        >
                            Add Contact
                        </Button>

                        <AddContact
                            open={AddContactOpen}
                            onClose={() => setAddContactOpen(false)}
                        />
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
