import { Avatar, Card, Col, Flex, Image, Row, Space, Typography } from 'antd'
import { FaWifi } from 'react-icons/fa'
import { GiNetworkBars } from 'react-icons/gi'
import { RiBattery2ChargeFill } from 'react-icons/ri'
import Island from "../../../assets/Island.png"
import { DownOutlined, LockOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
const { Text } = Typography;

function PhonePreview() {
    const [open, setOpen] = useState(false);
    return (
        <Flex xs={24} lg={8} >
            <Col
                style={{
                    width: 300,
                    height: 550,
                    margin: "0 auto",
                    border: "1.5px solid #222",
                    borderRadius: 40,
                    padding: 6,
                    background: "#f8f8f8",
                    position: "relative",
                    boxSizing: "border-box",
                }}
            >
                <Col
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid #222",
                        borderRadius: 34,
                        paddingInline: 0,
                        background: "#fff",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Col
                        style={{
                            height: 55,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontWeight: 600,
                            fontSize: 16,
                            position: "relative",
                        }}
                    >
                        <Col>4:43</Col>

                        <Col>
                            <Image src={Island} alt="Dynamic Island" style={{ width: 78, height: 26 }} preview={true} />
                        </Col>

                        <Col><GiNetworkBars /> <FaWifi /> <RiBattery2ChargeFill /></Col>
                    </Col>
                    <Col>
                        <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: 10 }}>
                            {/* Header */}
                            <Space align="center" style={{ width: "100%", }}>
                                <Avatar size={35}>G</Avatar>

                                <div style={{ flex: 1 }}>
                                    <div>
                                        <Row>
                                            <Col style={{ gap: 5 }}>
                                                <Text strong>Google</Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
                                                <Text type="secondary">to me</Text>
                                                <span
                                                    style={{ cursor: "pointer", fontSize: 10, }}

                                                >
                                                    {open ? <UpOutlined /> : <DownOutlined />}
                                                </span>
                                            </Col>
                                        </Row>



                                    </div>
                                </div>
                            </Space>

                            {/* Expandable Details */}
                            {open && (
                                <Card
                                    size="small"
                                    style={{
                                        marginTop: 16,
                                        background: "#f7f7f7",
                                        borderRadius: 12,
                                        // padding: 12,
                                        width: 250,

                                    }}
                                >
                                    <div style={{ marginBottom: 5 }}>
                                        <Text type="secondary"
                                            style={{ display: "inline-block", width: 40, }} >
                                            From
                                        </Text>

                                        <Text style={{ fontSize: 13 }}>
                                            jadavkrupali99@google.com
                                        </Text>
                                    </div>

                                    <div style={{ marginBottom: 5 }}>
                                        <Text type="secondary" style={{
                                            display: "inline-block",
                                            width: 40,
                                        }}>
                                            To
                                        </Text>
                                        <Text style={{ fontSize: 13 }}>
                                            harshvivaghela05@gmail.com
                                        </Text>
                                    </div>

                                    <div style={{ marginBottom: 5 }}>
                                        <Text type="secondary" style={{
                                            display: "inline-block",
                                            width: 40,
                                        }}>
                                            Date
                                        </Text>
                                        <Text style={{ fontSize: 13 }}>
                                            Jun 10, 2026, 11:13 AM
                                        </Text>
                                    </div>


                                    <div style={{ marginBottom: 5 }}>
                                        <Text type="secondary" style={{
                                            display: "inline-block",
                                            width: 40,
                                        }}>
                                            <LockOutlined />
                                        </Text>
                                        <Text style={{ fontSize: 13 }}>
                                            harshvivaghela05@gmail.com
                                        </Text>
                                    </div>

                                    <div>
                                        <Text style={{
                                            display: "inline-block",
                                            width: 40,
                                        }}></Text>
                                        <a href="#">View security details</a>
                                    </div>
                                </Card>
                            )}
                        </Card>
                    </Col>
                </Col>
            </Col>
        </Flex>
    )
}

export default PhonePreview