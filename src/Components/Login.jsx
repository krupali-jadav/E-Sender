
import React, { useEffect, useRef, useState } from "react";
import {
    Tooltip,
    Button,
    Col,
    Form,
    Row,
    Space,
    // Image,
    Typography,
    message,
    Input,
    Checkbox,
    Divider,
    Card,
    Layout,
    ConfigProvider,
    theme as antdTheme,
} from "antd";
import {
    EditOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import PhoneInput from "antd-phone-input";
// import { getMediaPath } from "../../util/getMediaPath.js";

const { Text } = Typography;

function Login() {
    const otpRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [isValidOTP, setIsValidOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkTerms, setCheckTerms] = useState(true);
    const [tick, setTick] = useState(30);
    const [resend, setResend] = useState(false);

    // const logo = getMediaPath("/media/panel/logo-long.png");

    useEffect(() => {
        if (!isLoginPage && otpRef.current) {
            otpRef.current.focus();
        }
    }, [isLoginPage]);

    useEffect(() => {
        if (!isLoginPage) {
            const timeOut = setTimeout(() => {
                setTick((t) => t - 1);
            }, 1000);
            if (tick < 1) {
                clearTimeout(timeOut);
            }

            if (tick === 0) {
                setResend(true);
            }
            return () => clearTimeout(timeOut);
        }
    }, [isLoginPage, tick]);

    const handlePhoneChange = (valueOrEvent) => {
        if (!valueOrEvent) {
            setPhone("");
            return;
        }
        if (valueOrEvent?.target && typeof valueOrEvent.target.value === 'string') {
            const digits = valueOrEvent.target.value.replace(/\D/g, '');
            setPhone(digits.slice(-10));
            return;
        }
        if (typeof valueOrEvent === 'string') {
            const digits = valueOrEvent.replace(/\D/g, '');
            setPhone(digits.slice(-10));
            return;
        }
        if (typeof valueOrEvent === 'object') {
            try {
                if (typeof valueOrEvent.valid === 'function' && !valueOrEvent.valid()) {
                    setPhone('');
                    return;
                }
            } catch (error) {
                console
            }

            // Combine areaCode + phoneNumber if available, otherwise use formatted value
            const area = valueOrEvent.areaCode || '';
            const phoneNum = valueOrEvent.phoneNumber || '';
            let combined = '';
            if (area || phoneNum) {
                combined = `${area}${phoneNum}`;
            } else if (typeof valueOrEvent.value === 'string') {
                combined = valueOrEvent.value;
            } else if (typeof valueOrEvent.phone === 'string') {
                combined = valueOrEvent.phone;
            }

            const digits = ('' + combined).replace(/\D/g, '');
            // store last 10 digits (local mobile number)
            setPhone(digits.length >= 10 ? digits.slice(-10) : '');
            return;
        }

        setPhone('');
    };

    const onSendOtp = () => {
        // Simulated OTP send
        setLoading(true);
        setTick(30);
        setResend(false);
        setOtp("");
        setTimeout(() => {
            setIsLoginPage(false);
            message.success(`OTP sent to ${phone || "your number"}`);
            setLoading(false);
        }, 700);
    };

    const onOtpVerify = () => {
        // Simulated OTP verification: correct OTP is 123456
        setLoading(true);
        setTimeout(() => {
            if (otp === "123456") {
                message.success("Login Successfully");
            } else {
                message.error("Invalid OTP");
            }
            setLoading(false);
        }, 700);
    };

    const onResend = () => onSendOtp();

    const onEditPhoneNumber = () => setIsLoginPage(true);

    // theme toggle removed

    return (
        <Layout
            style={{
                height: "100vh",
                width: "100vw",
                // backgroundImage: `url(${getMediaPath("/media/background/login-bg.svg")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div style={{ padding: 12, display: "flex", justifyContent: "flex-end" }}>
                <ConfigProvider
                    theme={{
                        algorithm: antdTheme.defaultAlgorithm,
                        token: {},
                        components: { Form: { labelColor: "rgba(0,0,0,0.8)" } },
                    }}
                >
                    <div style={{ padding: 10 }} />
                </ConfigProvider>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
                <Row>
                    {isLoginPage ? (
                        <Col xs={24} sm={24} md={12} xl={10}>
                            <Form onFinish={onSendOtp} layout="vertical" style={{ width: 380 }}>
                                <Card>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {/* <Image preview={false} src={logo} alt="logo" loading="lazy" height={100} /> */}
                                    </div>

                                    <div>
                                        <Form.Item name="phone" label={"Phone Number"} initialValue={phone}>
                                            <PhoneInput
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                placeholder="Enter phone number"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        onSendOtp();
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item style={{ maxWidth: 300 }}>
                                        <Checkbox onChange={(e) => setCheckTerms(e.target.checked)} defaultChecked>
                                            Keep me signed in
                                        </Checkbox>
                                        <Text type="secondary">
                                            <Space>
                                                <Tooltip title={"This will keep you signed in until you manually sign out"}>
                                                    <ExclamationCircleOutlined />
                                                </Tooltip>
                                            </Space>
                                        </Text>
                                        <Divider />
                                        <Text>
                                            By continuing, you agree to our <Link to="/privacy-policy" target="_blank">Privacy Policy</Link> &{' '}
                                            <Link to="/terms-and-conditions" target="_blank">Terms and Conditions</Link>
                                        </Text>
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" loading={loading} disabled={!checkTerms || phone.length !== 10} style={{ width: "100%" }}>
                                        Send OTP
                                    </Button>
                                </Card>
                            </Form>
                        </Col>
                    ) : (
                        <Col sm={24} md={10} xl={10}>
                            <Form layout="vertical" onFinish={onOtpVerify} style={{ width: 370 }}>
                                <Card>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {/* <Image loading="lazy" preview={false} src={logo} alt="logo" height={100} /> */}
                                    </div>

                                    <Space direction="vertical">
                                        <Text className="font-regular" type="primary">
                                            We've sent a verification code to <b>{phone}</b>
                                            <EditOutlined onClick={onEditPhoneNumber} style={{ marginLeft: 8 }} />
                                        </Text>

                                        <Form.Item label={"Enter OTP"} style={{ marginBottom: 0 }}>
                                            <Input
                                                ref={otpRef}
                                                maxLength={6}
                                                onChange={(e) => {
                                                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                                    setOtp(numericValue);
                                                    setIsValidOTP(numericValue.length === 6);
                                                }}
                                                onPressEnter={onOtpVerify}
                                                value={otp}
                                                style={{ height: 45, marginBottom: 0 }}
                                            />
                                        </Form.Item>

                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Text type="secondary">
                                                <Typography.Title style={{ marginTop: 0 }} level={5} type="secondary">
                                                    {tick > 0 ? (tick >= 10 ? `00:${tick}` : `00:0${tick}`) : ""}
                                                </Typography.Title>
                                            </Text>
                                        </div>

                                        <Form.Item>
                                            <Button block type="primary" htmlType="submit" loading={loading} disabled={!isValidOTP}>
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Space>

                                    <Form.Item>
                                        <Space>
                                            <Text>Didn't get the OTP?</Text>
                                            {resend ? (
                                                <Button type="link" onClick={onResend} style={{ padding: 0 }}>
                                                    Resend
                                                </Button>
                                            ) : (
                                                <Text type="secondary" disabled>
                                                    Resend
                                                </Text>
                                            )}
                                        </Space>
                                    </Form.Item>
                                </Card>
                            </Form>
                        </Col>
                    )}
                </Row>
            </div>
        </Layout>
    );
}

export default Login;
