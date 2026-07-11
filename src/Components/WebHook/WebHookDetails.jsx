import { CopyOutlined, DeleteOutlined, EditOutlined, MoreOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Col, Descriptions, Dropdown, Flex, Input, Popover, Row, Space, Table, Tag, Typography } from 'antd';
import Title from 'antd/es/skeleton/Title';
import { t } from 'i18next';
import React from 'react'

function WebHookDetails() {
    const secret = "jff45dwcv45fcq45465"
    const items = [
        {
            key: "edit",
            icon: <EditOutlined />,
            label: t("edit.endpoint", { defaultValue: "Edit endpoint" }),
        },
        {
            key: "disable",
            icon: <StopOutlined />,
            label: t("disable.endpoint", { defaultValue: "Disable endpoint" }),
        },
        {
            key: "rotate",
            icon: <SyncOutlined />,
            label: t("rotate.signing.secret", { defaultValue: "Rotate signing secret" }),
        },
        {
            key: "duplicate",
            icon: <CopyOutlined />,
            label: t("duplicate.webhook", { defaultValue: "Duplicate webhook" }),
        },
        {
            type: "divider",
        },
        {
            key: "delete",
            icon: <DeleteOutlined />,
            label: t("delete.webhook", { defaultValue: "Delete webhook" }),
            danger: true,
        },
    ];

    const columns = [
        {
            title: t("endpoint", { defaultValue: "Endpoint" }),
            dataIndex: "endpoint",
            key: "endpoint",
        },
        {
            title: t("listening.for", { defaultValue: "Listening For" }),
            dataIndex: "listeningFor",
            key: "listeningFor",
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            width: 200,
            key: "status",
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200
        },
        {
            title: t("signing.secret", { defaultValue: "Signing Secret" }),
            dataIndex: "signingSecret",
            key: "signingSecret",
        },
    ];
    const events = [
        "contact.created",
        "contact.deleted",
        "contact.updated",
        "contact.blocked",
        "contact.unblocked",
    ];

    return (

        <PageContainer title={false}>
            <Space direction='vertical' size="large" style={{ width: "100%" }}>
                <Card>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Typography.Text type="secondary">
                                        {t("webhook", { defaultValue: "WebHook" })}
                                    </Typography.Text>

                                    <Typography.Title level={4}>
                                        https://resend.com/webhooks
                                    </Typography.Title>
                                </Space>
                            </Col>

                            <Col>
                                <Dropdown
                                    menu={{ items }}
                                    trigger={["click"]}
                                >
                                    <Button icon={<MoreOutlined />} />
                                </Dropdown>
                            </Col>
                        </Row>

                        <Row gutter={[32, 24]}>
                            <Col flex={0.6}>
                                <Space direction='vertical' size={0} >
                                    <Typography.Text type="secondary">
                                        {t("listening.for", { defaultValue: "Listening For" })}
                                    </Typography.Text>
                                    <Flex gap={5}>
                                        {events.slice(0, 2).map((event) => (
                                            <Tag key={event}>{event}</Tag>
                                        ))}

                                        {events.length > 2 && (
                                            <Popover
                                                placement='bottomLeft'
                                                content={
                                                    <Space direction="vertical">
                                                        {events.slice(2).map((event) => (
                                                            <Tag key={event}>{event}</Tag>
                                                        ))}
                                                    </Space>
                                                }
                                                trigger="hover"
                                            >
                                                <Tag style={{ cursor: "pointer" }}>
                                                    +{events.length - 2}
                                                </Tag>
                                            </Popover>
                                        )}
                                    </Flex>
                                </Space>
                            </Col>

                            <Col flex={0.6}>
                                <Space direction="vertical" size={4}>
                                    <Typography.Text type="secondary">
                                        {t("status", { defaultValue: "Status" })}
                                    </Typography.Text>

                                    <Tag color="green">
                                        {t("enabled", { defaultValue: "Enabled" })}
                                    </Tag>
                                </Space>
                            </Col>

                            <Col flex={0.6}>
                                <Space direction="vertical" size={4}>
                                    <Typography.Text type="secondary">
                                        {t("created.at", { defaultValue: "Created At" })}
                                    </Typography.Text>

                                    <Typography.Text>
                                        11-06-2026 5:08 PM
                                    </Typography.Text>
                                </Space>
                            </Col>

                            <Col flex="auto"    >
                                <Space direction="vertical" size={4}>
                                    <Typography.Text type="secondary">
                                        {t("signing.secret", { defaultValue: "Signing Secret" })}
                                    </Typography.Text>

                                    <Space.Compact>
                                        <Input.Password
                                            value={secret}
                                            readOnly
                                        />

                                        <Button
                                            icon={<CopyOutlined />}
                                            onClick={() => navigator.clipboard.writeText(secret)}
                                        />
                                    </Space.Compact>
                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </Card>
                <Card styles={{ body: { padding: 0 } }} >
                    <Table
                        pagination={false}
                        columns={columns}
                    // dataSource={data}
                    />
                </Card>
            </Space>
        </PageContainer >
    )
}

export default WebHookDetails