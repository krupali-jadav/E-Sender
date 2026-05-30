import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, Modal, notification, Flex } from "antd";
import {
    WindowsOutlined,
    MobileOutlined,
    LogoutOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";

import { t } from "i18next";
import { sessionAll, sessionLogout } from "./SessionAll";
// import { formatDate } from "../../util/common.utils";
const { Title, Text } = Typography;

const Sessions = () => {
    const [sessionData, setSessionData] = useState([]);
    const [loadingButton, setButtonLoading] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        sessionDevices();
    }, []);

    const sessionDevices = async () => {
        setLoading(true);
        try {
            const data = await sessionAll({ status: "all" });
            if (data.status) {
                setSessionData(data.sessions);
            }
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to fetch session data." });
            console.error("Error fetching session devices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionLogout = (id) => {
        Modal.confirm({
            title: t("confirm.logout"),
            icon: <InfoCircleOutlined />,
            content: t("session.content"),
            cancelText: t("cancel"),
            okText: t("ok"),
            onOk: async () => {
                setButtonLoading((prev) => ({ ...prev, [id]: true }));
                try {
                    const data = await sessionLogout({ session_id: id });
                    if (data?.status) {
                        notification.success({
                            message: t("success"),
                            description: t("session.successfully"),
                        });
                        await sessionDevices();
                    }
                } catch (error) {
                    notification.error({
                        message: t("error"),
                        description: t("failed.log.out.session."),
                    });
                    console.error("Error logging out session devices:", error);
                } finally {
                    setButtonLoading((prev) => ({ ...prev, [id]: false }));
                }
            },
        });
    };

    const renderSessions = (sessions, icon, color, title) => (
        <Card>
            <Row gutter={[16, 24]} align="middle" style={{ marginBottom: 16 }} justify="space-between"  >
                <Col>
                    <Flex align="center" justify="space-between">
                        {React.cloneElement(icon, { style: { fontSize: "28px", color } })}
                        <Title level={5} style={{ margin: 0, marginLeft: "10px" }}>{title}</Title>{" "}
                    </Flex>

                </Col>
                <Col>

                    <Title level={4} style={{ margin: 0 }}>
                        {sessions?.length}
                    </Title>
                </Col>
            </Row>
            <div
                style={{
                    maxHeight: "450px",
                    overflowY: "auto",
                    padding: "1rem",
                }}
            >
                {sessions?.map((item) => (
                    <div
                        key={item._id}
                        style={{
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "12px",
                            border: "1px solid #EBEBEB",
                            transition: "box-shadow 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text strong style={{ display: "block", fontSize: "16px" }}>
                                    {item?.info?.os?.name || "Unknown OS"}
                                </Text>
                                <Text type="secondary" style={{ fontSize: "14px" }}>
                                    {item?.info?.client?.name || "Unknown Browser"}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                    {t("last.active")}{" "}
                                    {item?.createdAt
                                        ? formatDate(item.createdAt)
                                        : "N/A"}
                                </Text>
                            </Col>
                            <Col>
                                {!item?.logout ? (
                                    <Button
                                        type="primary"
                                        icon={<LogoutOutlined />}
                                        loading={loadingButton[item._id]}
                                        onClick={() => handleSessionLogout(item._id)}
                                    >
                                        {t("layout.logout")}
                                    </Button>
                                ) : (
                                    <Text type="secondary">{t("signedout")}</Text>
                                )}
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        </Card>
    );

    return (
        <React.Fragment>
            {loading ? (
                <Col
                    style={{
                        height: "50vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin spinning={loading} />
                </Col>
            ) : (
                <Row
                    gutter={[16, 24]}
                    style={{
                        padding: "20px",
                        minHeight: "57vh",
                    }}
                >
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "windows"),
                            <WindowsOutlined />,
                            "#52C41A",
                            t("desktop.sessions")
                        )}
                    </Col>
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "android"),
                            <MobileOutlined />,
                            "#FAAD14",
                            t("mobile.sessions")
                        )}
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );
};

export default Sessions;