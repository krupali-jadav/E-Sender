import { useState } from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, DatePicker, Flex, Form, Modal, Radio, Select, Space, Table, Tag } from 'antd'
import { ImportOutlined, PlusOutlined } from '@ant-design/icons'
// import { t } from 'i18next'
import ExcelImport from '../Contacts/ExcelImport'
import ManualImport from '../Contacts/ManualImport'
import AddContact from '../Contacts/AddContact'

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

    const [excelOpen, setExcelOpen] = useState(false);
    const [manualImportOpen, setManualImportOpen] = useState(false);
    const [AddContactOpen, setAddContactOpen] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterType, setFilterType] = useState("all-time");
    const [status, setStatus] = useState("All");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterForm] = Form.useForm();
    const { RangePicker } = DatePicker;
    const resetFilterParameters = () => {
        setFilterType("all-time");
        setStartDate(null);
        setEndDate(null);
        setStatus("all");
        setShowFilterModal(false);
        filterForm.resetFields();
    };

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
                            {/* {t("manual_import", { defaultValue: "Manual Import" })} */}
                            Manual Import
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
                            {/* {t("excel_import", { defaultValue: "Excel Import" })} */}
                            Excel Import
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
                            {/* {t("add_contact", { defaultValue: "Add Contact" })} */}
                            Add Contact
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
                    onFilterClick={() => { setShowFilterModal(true); }} 
                    page="contacts"
                    />

                    <Card >
                        <Table
                            columns={columns}
                            // dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>

                    <Modal
                        // title={t("filter.orders", { defaultValue: "Filter Orders" })}
                        title="Filter Contacts"
                        open={showFilterModal}
                        centered
                        onCancel={() => setShowFilterModal(false)}
                        // okText={t("apply", { defaultValue: "Apply" })}
                        okText="Apply"
                        // cancelText={t("cancel", { defaultValue: "Cancel" })}
                        cancelText="Cancel"
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
                                // label={t("filterbystatus", { defaultValue: "Filter by Status" })}
                                label="Filter by Groups"
                            >
                                <Select
                                    value={status}
                                // onChange={(value) => {
                                //     setStatus(value);
                                // }}
                                >
                                    <Option value="all">
                                        {/* {t("all", { defaultValue: "All" })} */}
                                        All
                                    </Option>
                                    
                                </Select>
                            </Form.Item>
                            <Form.Item
                                // label={t("filterbystatus", { defaultValue: "Filter by Status" })}
                                label="Filter by Blocked"
                            >
                                <Select
                                    value={status}
                                // onChange={(value) => {
                                //     setStatus(value);
                                // }}
                                >
                                    <Option value="all">
                                        {/* {t("all", { defaultValue: "All" })} */}
                                        All
                                    </Option>
                                    
                                </Select>
                            </Form.Item>
                             <Form.Item
                                // label={t("filterbystatus", { defaultValue: "Filter by Status" })}
                                label="Filter by Unsubscribed"
                            >
                                <Select
                                    value={status}
                                // onChange={(value) => {
                                //     setStatus(value);
                                // }}
                                >
                                    <Option value="all">
                                        {/* {t("all", { defaultValue: "All" })} */}
                                        All
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
