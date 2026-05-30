import { DownloadOutlined, FilterOutlined, RedoOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Input } from 'antd';
import { Badge, Button, Card, Col, Row, Select } from 'antd'
import { t } from 'i18next'
import React from 'react'

function SearchHeader() {

    const sortByItems = [
        {
            key: "1",
            // label: t("sort.by.name", {defaultValue: "Sort by Name",}),
            label: "Sort by Name",
            value: "name",
        },
        {
            key: "2",
            // label: t("sort.by.createat", {defaultValue: "Sort by Created At",}),
            label: "Sort by Created At",
            value: "create-at",
        },
        {
            key: "3",
            // label: t("sort.by.end_date", {defaultValue: "Sort by End Date",}),
            label: "Sort by End Date",
            value: "end_date",
        },
        {
            key: "4",
            // label: t("sort.by.start_date", {defaultValue: "Sort by Start Date",}),
            label: "Sort by Start Date",
            value: "start_date",
        },
    ];

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
                    <Row gutter={[10, 10]}>
                        {/* Reset */}
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Button block>
                                <RedoOutlined />
                                {/* {t("reset", { defaultValue: "Reset" })} */}
                                Reset
                            </Button>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Button block>
                                <FilterOutlined />{" "}
                                {/* {t("filter", { defaultValue: "Filter" })} */}
                                Filter
                            </Button>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Select
                                // value={sortBy}
                                optionFilterProp="children"
                                menuItemSelectedIcon={<SortAscendingOutlined />}
                                // onChange={(value) => setSortBy(value)}
                                options={sortByItems}
                                style={{ width: "100%" }}
                                placeholder="Sort By Create At"
                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6}>
                            <Button
                                // loading={exporting}
                                // disabled={exporting}
                                type="primary"
                                // onClick={onExport}
                                block
                                icon={<DownloadOutlined />}
                            >
                                {/* {t("export", {
                                    defaultValue: "Export",
                                })} */}
                                Export
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default SearchHeader