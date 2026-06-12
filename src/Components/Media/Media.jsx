import React, { useState } from "react";
import { PlusOutlined, FileImageOutlined, VideoCameraOutlined, FileTextOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Flex, Space, Tabs, Row, Col } from "antd";
import { t } from "i18next";

import SearchHeader from "../Search Header/SearchHeader";
import AddMedia from "./AddMedia";

function Media() {
    const [activeTab, setActiveTab] = useState("all");
    const [addMediaOpen, setAddMediaOpen] = useState(false);

    const [mediaList, setMediaList] = useState([
        {
            id: 1,
            name: "Nature Image",
            type: "images",
            url: "https://picsum.photos/400/250",
        },
    ]);

    const tabItems = [
        {
            key: "all",
            label: "All",
        },
        {
            key: "images",
            label: "Images",
        },
        {
            key: "videos",
            label: "Videos",
        },
        {
            key: "documents",
            label: "Documents",
        },
        {
            key: "other",
            label: "Other",
        },
    ];

    const handleAddMedia = (newMedia) => {
        setMediaList((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...newMedia,
            },
        ]);
    };

    const filteredMedia =
        activeTab === "all"
            ? mediaList
            : mediaList.filter((item) => item.type === activeTab);

    return (
        <PageContainer
            extra={
                <Flex>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAddMediaOpen(true)}
                    >
                        {t("create.webhook", {
                            defaultValue: "Add Media",
                        })}
                    </Button>

                    <AddMedia
                        open={addMediaOpen}
                        onClose={() => setAddMediaOpen(false)}
                        onAdd={handleAddMedia}
                    />
                </Flex>
            }
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <SearchHeader page="media" />

                <Tabs
                    type="card"
                    activeKey={activeTab}
                    items={tabItems}
                    onChange={(key) => setActiveTab(key)}
                />

            </Space>

            <Row gutter={[8, 8]}>
                {filteredMedia.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={5} key={item.id}>
                        <Card
                            hoverable
                            style={{ width: 300 }}
                            cover={
                                item.type === "images" &&
                                    item.url ? (
                                    <img
                                        alt={item.name}
                                        src={item.url}
                                        style={{ height: 200, objectFit: "cover", }}
                                    />
                                ) : (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        style={{ height: 200, }}
                                    >
                                        {/* {getIcon(item.type)} */}
                                    </Flex>
                                )
                            }
                        >
                            <Card.Meta
                                title={item.name}
                            // description={item.type}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </PageContainer>
    );
}

export default Media;