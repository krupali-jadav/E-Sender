import { DownloadOutlined, FilterOutlined, RedoOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Flex, Input } from 'antd';
import { Button, Card, Col, Row, Select } from 'antd'
import { t } from 'i18next'

function SearchHeader({ page, onFilterClick, onExport, exporting }) {
    let sortByItems = [];
    if (page === "contacts") {
        sortByItems = [
            {
                key: 1,
                // label: t("sort_by._name", {defaultValue: "Sort by Name",}),
                label: "Sort by Name",
                value: "name",
            },
            {
                key: 2,
                // label: t("sort_by_createat", {defaultValue: "Sort by Created At",}),
                label: "Sort by Created At",
                value: "create-at",
            },
        ];
    } else if (page === "orders") {
        sortByItems = [
            {
                key: 1,
                // label: t("sort_by_type", {defaultValue: "Sort by type",}),
                label: "Sort by Type",
                value: "type",
            },
            {
                key: 2,
                // label: t("sort_by_status", {defaultValue: "Sort by Status",}),
                label: "Sort by Status",
                value: "status",
            },
            {
                key: 3,
                // label: t("sort_by_createat", {defaultValue: "Sort by Created At",}),
                label: "Sort by Created At",
                value: "create-at",
            },
        ]
    } else if (page === "groups") {
        sortByItems = [
            {
                key: 1,
                // label: t("sort_by._name", {defaultValue: "Sort by Name",}),
                label: "Sort by Name",
                value: "name",
            },
            {
                key: 2,
                // label: t("sort_by_createat", {defaultValue: "Sort by Created At",}),
                label: "Sort by Created At",
                value: "create-at",
            },
        ];
    } else if (page === "custom-fields") {
        sortByItems = [
            {
                key: 1,
                // label: t("sort_by_type", {defaultValue: "Sort by type",}),
                label: "Sort by Type",
                value: "type",
            },
            {
                key: 2,
                // label: t("sort_by_status", {defaultValue: "Sort by Status",}),
                label: "Sort by Status",
                value: "status",
            },
            {
                key: 3,
                // label: t("sort_by_createat", {defaultValue: "Sort by Created At",}),
                label: "Sort by Created At",
                value: "create-at",
            },
        ]
    }

    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
                    <Input.Search
                        // placeholder={t("search_leads", {
                        //     defaultValue: "Search Leads",
                        // })}
                        placeholder="Search Contacts"
                        enterButton={<SearchOutlined />}
                        allowClear
                    />
                </Col>

                <Col xs={0} sm={0} md={0} lg={0} xl={4} xxl={4} />



                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                    <Flex justify="end" gap={10} wrap>
                        <Button style={{ minWidth: "18%" }}>
                            <RedoOutlined />
                            {/* {t("reset", { defaultValue: "Reset" })} */}
                            Reset
                        </Button>

                        <Button style={{ minWidth: "18%" }} onClick={onFilterClick}>
                            <FilterOutlined />{" "}
                            {/* {t("filter", { defaultValue: "Filter" })} */}
                            Filter
                        </Button>

                        <Select
                            // value={sortBy}
                            optionFilterProp="children"
                            menuItemSelectedIcon={<SortAscendingOutlined />}
                            // onChange={(value) => setSortBy(value)}
                            options={sortByItems}
                            style={{ minWidth: "22%" }}
                            // placeholder={t("sort_by_createdAt", { defaultValue: "Sort By Create At",})}
                            placeholder="Sort By Create At"
                        />

                        <Button
                            // disabled={exporting}
                            type="primary"
                            style={{ minWidth: "18%" }}
                            loading={exporting}
                            onClick={onExport}
                            icon={<DownloadOutlined />}
                        >
                            {/* {t("export", { defaultValue: "Export", })} */}
                            Export
                        </Button>
                    </Flex>
                </Col>


            </Row>
        </Card>
    )
}

export default SearchHeader