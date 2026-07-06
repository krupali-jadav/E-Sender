import { useEffect, useState } from "react";
import { DeleteOutlined, FileExcelOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Flex, Space, Tabs, Row, Col, message, Modal, Typography, Spin, Empty, Checkbox, Pagination } from "antd";
import { t } from "i18next";
import SearchHeader from "../../Components/Search Header/SearchHeader";
import AddMedia from "./AddMedia";
import { deleteMedia, deleteMultipleMedia, getAllMedia } from "./MediaApi";
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
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [total, setTotal] = useState(0);
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
                setTotal(data.total || 0);
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

    const handleDeleteMedia = (record = null) => {
        const isMultiple = !record;
        Modal.confirm({
            title: isMultiple ? "Delete Selected Media" : "Delete Media",
            content: isMultiple
                ? `Are you sure you want to delete ${selectedMedia.length} selected media?`
                : `Are you sure you want to delete "${record.name}"?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    let data;

                    if (isMultiple) {
                        data = await deleteMultipleMedia({
                            media_ids: selectedMedia,
                        });
                    } else {
                        data = await deleteMedia({
                            media_id: record._id,
                        });
                    }

                    if (data?.status) {
                        message.success(data?.message || "Media deleted successfully");
                        setSelectedMedia([]);
                        fetchMedia();   
                    }
                } catch (error) {
                    console.log(error);
                    message.error(data?.message || "Failed to delete media");
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
                <Flex gap={10}>
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
                    <Button
                        danger
                        disabled={!selectedMedia.length}
                        onClick={() => handleDeleteMedia()}
                    >
                        Delete Selected
                    </Button>
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
            ) : mediaList.length === 0 ? (
                <Empty
                    description="No Media Available"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button
                        type="primary"
                        onClick={() => setAddMediaOpen(true)}
                        icon={<PlusOutlined />}
                    >
                        Add Media
                    </Button>
                </Empty>
            ) : (
                <>
                    <Row gutter={[14, 14]}>
                        {mediaList.map((item) => (
                            <Col key={item._id}>
                                <div
                                    onMouseEnter={() => setHoveredId(item._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        position: "relative",
                                        width: 220,
                                    }}
                                >
                                    <Card xs={24} sm={12} md={8} lg={4} 
                                        hoverable
                                        style={{
                                            placeItems: "center",
                                            height: 220,
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
                                                inset: 0,
                                                background: "rgba(0,0,0,0.4)",
                                            }}
                                        >
                                            <Space size={16}>
                                                <Checkbox
                                                    checked={selectedMedia.includes(item._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedMedia((prev) => [...prev, item._id]);
                                                        } else {
                                                            setSelectedMedia((prev) =>
                                                                prev.filter((id) => id !== item._id)
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        background: "#fff",
                                                        padding: 8,
                                                        height: 30,
                                                        width: 32,
                                                        borderRadius: 6,
                                                    }}
                                                />

                                                <Button
                                                    danger
                                                    shape="circle"
                                                    onClick={() => handleDeleteMedia(item)}
                                                >
                                                    <DeleteOutlined />
                                                </Button>
                                            </Space>
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
                    <Flex justify="end" style={{ marginTop: 24 }}>
                        <Pagination
                            current={page}
                            total={total}
                            pageSize={20}
                            showSizeChanger={false}
                            onChange={(page) => setPage(page)}
                        />
                    </Flex>
                </>
            )}
        </PageContainer>
    );
}

export default Media;