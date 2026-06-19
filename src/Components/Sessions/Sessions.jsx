import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, Modal, notification, Flex, Space } from "antd";
import { WindowsOutlined, MobileOutlined, LogoutOutlined, InfoCircleOutlined, } from "@ant-design/icons";

import { t } from "i18next";
import { sessionAll, sessionLogout } from "./SessionAll";
import { formatDate } from "../../util/commom.utils";
const { Title, Text } = Typography;

const Sessions = () => {
    const [sessionData, setSessionData] = useState([]);
    const [loadingButton, setButtonLoading] = useState({});
    const [loading, setLoading] = useState(false);


    const sessionDevices = async () => {
         console.log("Calling session API...");
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
    useEffect(() => {
        sessionDevices();
    }, []);
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
                    <Space align="center">
                        {React.cloneElement(icon, { style: { color, fontSize: "28px" } })}
                        <Title level={5}>{title}</Title>
                    </Space>

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
                }}
            >
                {sessions?.map((item) => (
                    <Card
                        key={item._id}
                        size="small"
                        style={{ marginBottom: 12 }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text strong>
                                    {item?.info?.os || "Unknown OS"}
                                </Text>

                                <br />

                                <Text type="secondary">
                                    {item?.info?.browser || "Unknown Browser"}
                                </Text>
                                <br />
                                <Text type="secondary">
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
                    </Card>
                ))}
            </div>
        </Card>
    );

    return (
        <React.Fragment>
            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{ height: "50vh" }}
                >
                    <Spin spinning={loading} />
                </Flex>
            ) : (
                <Row
                    gutter={[16, 24]}
                    style={{ minHeight: "57vh" }}
                >
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter(
                                (item) =>
                                    item?.info?.os?.toLowerCase() === "windows"
                            ),
                            < WindowsOutlined />,
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