import React, { useEffect, useState } from "react";
import { PlusOutlined, FileImageOutlined, VideoCameraOutlined, FileTextOutlined, DeleteOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Flex, Space, Tabs, Row, Col, message, Modal } from "antd";
import { t } from "i18next";

import SearchHeader from "../Search Header/SearchHeader";
import AddMedia from "./AddMedia";
import { deleteMedia, getAllMedia } from "./MediaApi";

function Media() {
    const [activeTab, setActiveTab] = useState("all");
    const [addMediaOpen, setAddMediaOpen] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hoveredId, setHoveredId] = useState(null);

    const fetchMedia = async () => {
        setLoading(true);

        try {
            const data = await getAllMedia({
                page: page - 1,
                limit: 20,
                type:
                    activeTab === "all"
                        ? ""
                        : activeTab === "images"
                            ? "image"
                            : activeTab === "videos"
                                ? "video"
                                : activeTab === "documents"
                                    ? "document"
                                    : "other",
                search,
            });
            console.log("Media Response:", data.media);
            if (data?.status) {
                setMediaList(data.media || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [activeTab, search, page]);

    const handleDeleteMedia = (record) => {
        Modal.confirm({
            title: "Delete Media",
            content: `Are you sure you want to delete "${record.name}"?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    const data = await deleteMedia({
                        media_id: record._id,
                    });
                    if (data?.status) {
                        message.success(
                            data?.message || "Media deleted successfully"
                        );
                        fetchMedia();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        });
    };


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
                        fetchMedia={fetchMedia}
                    />
                </Flex>
            }
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <SearchHeader
                    page="media"
                    onSearch={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                />

                <Tabs
                    type="card"
                    activeKey={activeTab}
                    items={tabItems}
                    onChange={(key) => setActiveTab(key)}
                />

            </Space>

            <Row gutter={[16, 16]}>

                {mediaList.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={7} key={item._id}>
                        <div
                            onMouseEnter={() => setHoveredId(item._id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                position: "relative",
                                width: 250,
                                margin: "auto",
                            }}
                        >
                            <Card
                                hoverable
                                style={{
                                    placeItems: "center",
                                }}
                                cover={
                                    item.type?.startsWith("image/") ? (
                                        <img
                                            alt={item.name}
                                            src={item.url}
                                            style={{
                                                height: 250,
                                                width: 250,
                                                objectFit: "contain",
                                            }}
                                        />
                                    ) : null
                                }
                            />

                            {hoveredId === item._id && (
                                <Flex
                                    justify="center"
                                    align="center"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(0,0,0,0.4)",
                                    }}
                                >
                                    <Button
                                        danger
                                        type="primary"
                                        onClick={() => handleDeleteMedia(item)}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                            )}
                        </div>
                    </Col>
                ))}
            </Row>
        </PageContainer>
    );
}

export default Media;