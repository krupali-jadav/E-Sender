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
            message.error(error?.message || "Failed to fetch media");
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
                    message.error(error?.message || "Failed to delete media");
                }
            },
        });
    };

    const tabItems = [
        {
            key: "all",
            label: t("all", { defaultValue: "All" }),
        },
        {
            key: "images",
            label: t("images", { defaultValue: "Images" }),
        },
        {
            key: "videos",
            label: t("videos", { defaultValue: "Videos" }),
        },
        {
            key: "documents",
            label: t("documents", { defaultValue: "Documents" }),
        },
        {
            key: "other",
            label: t("other", { defaultValue: "Other" }),
        },
    ];

    return (
        <PageContainer
            extra={
                <Flex gap={10}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAddMediaOpen(true)}
                    >
                        {t("add.media", { defaultValue: "Add Media", })}
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
                        {t("delete.selected", { defaultValue: "Delete Selected" })}
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
                <Row justify="center" align="middle" style={{ minHeight: "40vh" }} >
                    <Spin size="middle" />
                </Row>
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
                        {t("add.media", { defaultValue: "Add Media" })}
                    </Button>
                </Empty>
            ) : (
                <>
                    <Row gutter={[10, 10]}>
                        {mediaList.map((item) => (
                            <Col key={item._id}>

                                <Card bodyStyle={{ padding: 0 }}>
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
                                        style={{ padding: 8, height: 30, }}
                                    />
                                    <div
                                        onMouseEnter={() => setHoveredId(item._id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        style={{
                                            position: "relative",
                                            width: 220,
                                        }}
                                    >
                                        <Card xs={24} sm={12} md={8} lg={4}
                                            style={{
                                                placeItems: "center",
                                                height: 220,
                                                borderRadius: 0,
                                            }}
                                            cover={
                                                item.type?.startsWith("image/") ? (
                                                    <img
                                                        alt={item.name}
                                                        src={item.url}
                                                        height={200}
                                                        width="100%"
                                                        style={{ objectFit: "contain", borderRadius: 0, }}
                                                    />
                                                ) : item.type?.startsWith("video/") ? (
                                                    <video
                                                        controls
                                                        height={210}
                                                        width="100%"
                                                        style={{ objectFit: "contain", }}
                                                    >
                                                        <source src={item.url} type={item.type} />
                                                    </video>
                                                ) : item.type === "application/pdf" || item.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                                                    <Flex
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
                                                    </Flex>
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
                                </Card>

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
                    <Flex justify="flex-end">
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