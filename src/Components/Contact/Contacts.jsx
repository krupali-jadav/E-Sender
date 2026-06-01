import  { useState } from 'react'
import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Flex, Space, Table, Tag } from 'antd'
import { ImportOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import ManualImport from './ManualImport'
import ExcelImport from './ExcelImport'
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
        title: "Company",
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
    const [excelOpen, setExcelOpen] = useState(false);
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
                            onClick={() => setOpen(true)}
                        >
                            {/* {t("manual_import", { defaultValue: "Manual Import" })} */}
                            Manual Import
                        </Button>

                        <ManualImport
                            open={open}
                            onClose={() => setOpen(false)}
                        />

                        <Button
                            type="primary"
                            icon={<ImportOutlined />}
                            onClick={() => setExcelOpen(true)}
                        >
                            {/* {t("excel_import", { defaultValue: "Excel Import" })} */}
                            Excel Import
                        </Button>

                        <ExcelImport
                            open={excelOpen}
                            onClose={() => setExcelOpen(false)}
                        />

                        <Button type="primary" icon={<PlusOutlined />}>
                            {/* {t("add_contact", { defaultValue: "Add Contact" })} */}
                            Add Contact
                        </Button>
                    </Flex>
                }
            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>

                    <SearchHeader />

                    <Card >
                        <Table
                            columns={columns}
                            // dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </Space>
            </PageContainer>
        </>
    )
}

export default Contacts
