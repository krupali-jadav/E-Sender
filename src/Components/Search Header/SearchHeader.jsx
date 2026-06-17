import { DownloadOutlined, FilterOutlined, RedoOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Flex, Input } from 'antd';
import { Button, Card, Col, Row, Select } from 'antd'
import { t } from 'i18next'

function SearchHeader({ page, onFilterClick, onExport, exporting, onSearch, onReset, searchValue }) {
    let sortByItems = [];
    if (page === "contacts") {
        sortByItems = [
            {
                key: 1,
                label: t("sort.by.name", { defaultValue: "Sort by Name", }),
                value: "name",
            },
            {
                key: 2,
                label: t("sort.by.createat", { defaultValue: "Sort by Created At", }),
                value: "create-at",
            },
        ];
    } else if (page === "orders") {
        sortByItems = [
            {
                key: 1,
                label: t("sort.by.type", { defaultValue: "Sort by type", }),
                value: "type",
            },
            {
                key: 2,
                label: t("sort.by.status", { defaultValue: "Sort by Status", }),
                value: "status",
            },
            {
                key: 3,
                label: t("sort.by.createat", { defaultValue: "Sort by Created At", }),
                value: "create-at",
            },
        ]
    } else if (page === "groups") {
        sortByItems = [
            {
                key: 1,
                label: t("sort.by.name", { defaultValue: "Sort by Name", }),
                value: "name",
            },
            {
                key: 2,
                label: t("sort.by.createat", { defaultValue: "Sort by Created At", }),
                value: "create-at",
            },
        ];
    } else if (page === "custom-fields") {
        sortByItems = [
            {
                key: 1,
                label: t("sort.by.type", { defaultValue: "Sort by type", }),
                value: "type",
            },
            {
                key: 2,
                label: t("sort.by.status", { defaultValue: "Sort by Status", }),
                value: "status",
            },
            {
                key: 3,
                label: t("sort.by.createat", { defaultValue: "Sort by Created At", }),
                value: "create-at",
            },
        ]
    }
    if (page === "media") {
        return (
            <Card>
                <Row>
                    <Col xs={24} sm={24} md={16} lg={8}>
                        <Input.Search
                            placeholder={t("search...", {
                                defaultValue: "Search...",
                            })}
                            enterButton={<SearchOutlined />}
                            allowClear
                            value={searchValue}
                            onSearch={(value) => onSearch?.(value)}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
                    <Input.Search
                        placeholder={t("search...", { defaultValue: "Search...", })}
                        enterButton={<SearchOutlined />}
                        allowClear
                        value={searchValue}
                        onSearch={(value) => onSearch?.(value)}
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </Col>

                <Col xs={0} sm={0} md={0} lg={0} xl={4} xxl={4} />

                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                    <Flex justify="end" gap={10} wrap>
                        <Button style={{ minWidth: "18%" }} onClick={onReset}>
                            <RedoOutlined />
                            {t("reset", { defaultValue: "Reset" })}
                        </Button>

                        <Button style={{ minWidth: "18%" }} onClick={onFilterClick}>
                            <FilterOutlined />{" "}
                            {t("filter", { defaultValue: "Filter" })}
                        </Button>

                        <Select
                            // value={sortBy}
                            optionFilterProp="children"
                            menuItemSelectedIcon={<SortAscendingOutlined />}
                            // onChange={(value) => setSortBy(value)}
                            options={sortByItems}
                            style={{ minWidth: "22%" }}
                            placeholder={t("sort.by.createat", { defaultValue: "Sort By Create At", })}
                        />

                        <Button
                            // disabled={exporting}
                            type="primary"
                            style={{ minWidth: "18%" }}
                            loading={exporting}
                            onClick={onExport}
                            icon={<DownloadOutlined />}
                        >
                            {t("export", { defaultValue: "Export", })}
                        </Button>
                    </Flex>
                </Col>


            </Row>
        </Card>
    )
}

export default SearchHeader