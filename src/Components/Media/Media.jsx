import { useEffect, useState } from "react";
import { DeleteOutlined, FileExcelOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Flex, Space, Tabs, Row, Col, message, Modal, Typography, Spin } from "antd";
import { t } from "i18next";
import SearchHeader from "../../Components/Search Header/SearchHeader";
import AddMedia from "./AddMedia";
import { deleteMedia, getAllMedia } from "./MediaApi";
import { useSelector } from "react-redux";

function Media() {
    const { Text } = Typography;
    const [activeTab, setActiveTab] = useState("all");
    const [addMediaOpen, setAddMediaOpen] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hoveredId, setHoveredId] = useState(null);
    const theme = useSelector((state) => state?.app?.theme);

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
                                    ? "application"
                                    : "other",
                search,
            });
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
                        {t("create.webhook", { defaultValue: "Add Media", })}
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

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
                    <Spin size="middle" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {mediaList.map((item) => (
                        <Col xs={24} sm={12} md={8} lg={4} key={item._id}>
                            <div
                                onMouseEnter={() => setHoveredId(item._id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    position: "relative",
                                    width: 240,
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
                                                    height: 220,
                                                    width: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : item.type?.startsWith("video/") ? (
                                            <video
                                                controls
                                                style={{
                                                    height: 220,
                                                    width: "100%",
                                                    objectFit: "contain",
                                                }}
                                            >
                                                <source src={item.url} type={item.type} />
                                            </video>
                                        ) : item.type === "application/pdf" || item.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                                            <div
                                                style={{
                                                    height: 220,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    objectFit: "contain",
                                                    gap: 10,
                                                }}
                                            >
                                                {item.type === "application/pdf" ? (
                                                    <FilePdfOutlined style={{ fontSize: 50, color: "red" }} />
                                                ) : (
                                                    <FileExcelOutlined style={{ fontSize: 50, color: "green" }} />
                                                )}
                                                <span style={{ textAlign: "center", fontSize: 12, }}>{item.name}</span>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    height: 220,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                        )
                                    }
                                >
                                </Card>

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
                                            shape="circle"
                                            size="Medium"
                                            onClick={() => handleDeleteMedia(item)}
                                        >
                                            <DeleteOutlined />
                                        </Button>
                                    </Flex>
                                )}
                            </div>
                            <Text
                                ellipsis={{ tooltip: item.name }}
                                style={{
                                    fontSize: 13,
                                    width: 220,
                                    color: theme ? "#fff" : "#383838",
                                    textAlign: "center",
                                }}
                            >
                                {item.name}
                            </Text>
                        </Col>
                    ))}
                </Row>
            )}
        </PageContainer>
    );
}

export default Media;