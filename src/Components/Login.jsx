import React, { useEffect, useRef, useState } from "react";
import '../../src/index.css';
import {
    Tooltip, Button, Col, Form, Row, Space, Typography, message, Input, Checkbox, Divider, Card, Layout, Flex, Image, Avatar, Select,
} from "antd";
import {
    EditOutlined, ExclamationCircleOutlined, MoonOutlined, SunOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "antd-phone-input";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../redux/reducers/Reducer.user";
import { getMediaPath } from "../util/getMediaPath";
import axiosInstance from "../util/axiosInstance";
import { store } from "../redux/store";
import { t } from "i18next";
const { Text } = Typography;
const { Content } = Layout;
import i18next from "i18next";
import lang from "../util/lang/lang.json";
import { setPanel, setTheme } from "../redux/reducers/reducer.app";

function Login() {
    const navigate = useNavigate();
    const otpRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checkTerms, setCheckTerms] = useState(true);
    const [tick, setTick] = useState(30);
    const [resend, setResend] = useState(false);
    const dispatch = useDispatch();
    const app = useSelector((state) => state?.app);
    const logo = app?.panel?.telecaller?.logo;
    const theme = useSelector((state) => state?.app?.theme);
    const language = useSelector((state) => state.app.language);
    const panel = useSelector((state) => state?.app?.panel);
    const otpValid = otp.length === 6;
    const canSendOtp = checkTerms && phone !== "";
    const countdown = tick > 0 ? `00:${String(tick).padStart(2, "0")}` : "";

    const toggleTheme = () => {
        const newTheme = !theme;
        dispatch(setTheme(newTheme));
        const currentPanel = panel || {};
        dispatch(
            setPanel({
                ...currentPanel,
                telecaller: {
                    ...currentPanel.telecaller,
                    theme: {
                        algorithm: newTheme ? "dark" : "light",
                        token: {
                            colorPrimary: "#1890ff",
                            borderRadius: 16,
                        },
                    },
                },
            }),
        );
    };

    useEffect(() => {
        if (!isLoginPage && otpRef.current) otpRef.current.focus();
    }, [isLoginPage]);

    useEffect(() => {
        if (isLoginPage) return;
        if (tick <= 0) {
            if (!resend) setResend(true);
            return;
        }
        const timer = setTimeout(() => setTick((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [isLoginPage, tick, resend]);

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""
                }${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };
    const onSendOtp = async () => {
        try {
            setLoading(true);
            setTick(30);
            setResend(false);
            setOtp("");

            const { data } = await axiosInstance.post("/api/auth/send-otp", {
                auth_type: "phone",
                phone: phone,
            });

            if (data.status) {
                setIsLoginPage(false);
                message.success(data.message);
                dispatch(setUserDetails(data));
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };
    const onOtpVerify = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/auth/verify-otp", {
                auth_type: "phone",
                phone: phone,
                otp: otp,
            });
            if (data.status) {
                message.success(
                    (data.message || "Login Successfully"),
                );
                dispatch(setUserDetails(data));
                navigate("/dashboard");
            } else {
                message.error(data.message);
            }
            console.log("api response", data);
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Layout style={{ minHeight: "100vh", }}>
                <Flex justify="end" align="center">
                    <Form
                        layout="inline"
                        style={{
                            padding: "15px",
                            alignItems: "center",
                        }}
                    >
                        <Form.Item noStyle>
                            {theme ? (
                                <MoonOutlined
                                    onClick={toggleTheme}
                                    style={{
                                        fontSize: 17,
                                        cursor: "pointer",
                                        marginRight: 20,
                                    }}
                                />
                            ) : (
                                <SunOutlined
                                    onClick={toggleTheme}
                                    style={{
                                        fontSize: 17,
                                        cursor: "pointer",
                                        marginRight: 20,
                                    }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            label={t("select.language", {
                                defaultValue: "Select Language",
                            })}
                            style={{ marginLeft: 10 }}
                        >
                            <Select
                                value={language ?? "en"}
                                listHeight={200}
                                showSearch
                                style={{
                                    height: 30,
                                    width: 150,
                                }}
                                // onChange={handleLanguageChange}
                                options={lang?.map((x) => ({
                                    value: x.key,
                                    label: x.name,
                                }))}
                                filterOption={(input, option) => {
                                    return option.label
                                        .toLowerCase()
                                        .includes(input.toLowerCase());
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Flex>
                <Content>
                    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                        {isLoginPage ? (
                            <Col xs={18} sm={15} md={10} lg={8} xl={7} xxl={5}>
                                <Card>
                                    <Flex justify="center">
                                        <Image
                                            preview={false}
                                            src={
                                                logo == ""
                                                    ? getMediaPath("/media/panel/logo-long.png")
                                                    : getMediaPath(logo)
                                            }
                                            alt="logo"
                                            loading="lazy"
                                            height={100}
                                        />
                                    </Flex>
                                    <Form layout="vertical" onFinish={onSendOtp}>
                                        <Form.Item
                                            name="phone"
                                            label={t("phone.number", { defaultValue: "Phone Number" })}
                                            initialValue={phone}
                                        >
                                            <PhoneInput
                                                enableSearch
                                                country={"in"}
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                placeholder={t("phone.number", { defaultValue: "Enter Phone Number" })}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        onSendOtp();
                                                    }
                                                }}
                                            />
                                        </Form.Item>

                                        <Form.Item>
                                            <Space direction="vertical">
                                                <Space>
                                                    <Checkbox
                                                        checked={checkTerms}
                                                        onChange={(e) =>
                                                            setCheckTerms(e.target.checked)
                                                        }
                                                    >
                                                        {t("keep.signed.in", { defaultValue: "Keep me signed in" })}
                                                    </Checkbox>

                                                    <Tooltip
                                                        title={t("keep.signed.in.tooltip", { defaultValue: "This will keep you signed in until you manually sign out" })}   >
                                                        <ExclamationCircleOutlined />
                                                    </Tooltip>
                                                </Space>

                                                <Divider />

                                                <Text type="secondary">
                                                    {t("terms.agreement", { defaultValue: "By continuing, you agree to our" })} {" "}
                                                    <Link
                                                        to="/privacy-policy"
                                                        target="_blank"
                                                    >
                                                        {t("privacy.policy", { defaultValue: "Privacy Policy" })}
                                                    </Link>{" "}
                                                    &{" "}
                                                    <Link
                                                        to="/terms-and-conditions"
                                                        target="_blank"
                                                    >
                                                        {t("terms.and.conditions", { defaultValue: "Terms and Conditions" })}
                                                    </Link>
                                                </Text>
                                            </Space>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                disabled={!canSendOtp}
                                                block
                                            >
                                                {t("send.otp", { defaultValue: "Send OTP" })}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        ) : (
                            <Col xs={18} sm={15} md={10} lg={8} xl={7} xxl={5}>
                                <Card justify="center" align="middle">
                                    <Image
                                        preview={false}
                                        src={
                                            logo == ""
                                                ? getMediaPath("/media/panel/logo-long.png")
                                                : getMediaPath(logo)
                                        }
                                        alt="logo"
                                        loading="lazy"
                                        height={100}
                                    />
                                    <Form layout="vertical" onFinish={onOtpVerify}>
                                        <Space direction="vertical" size="small">
                                            <Text type="secondary">
                                                {t("verification.code.sent", { defaultValue: "We've sent a verification code to" })} {" "}
                                                <b>{phone}</b>

                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setIsLoginPage(true)}
                                                />
                                            </Text>

                                            <Form.Item label={t("enter.otp", { defaultValue: "Enter OTP" })} name="otp">
                                                <Input.OTP
                                                    ref={otpRef}
                                                    length={6}
                                                    value={otp}
                                                    onChange={(value) => setOtp(value)}
                                                    format={(value) => value.replace(/\D/g, "")}
                                                    size="large"

                                                />
                                            </Form.Item>

                                            <Row justify="end">
                                                <Text type="secondary">
                                                    {countdown}
                                                </Text>
                                            </Row>

                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={loading}
                                                    disabled={!otpValid}
                                                    block
                                                >
                                                    {t("submit", { defaultValue: "Submit" })}
                                                </Button>
                                            </Form.Item>

                                            <Space>
                                                <Text>{t(" didnt.get.otp", { defaultValue: "Didn't get the OTP?" })}</Text>
                                                {resend ? (
                                                    <Button
                                                        type="link"
                                                        onClick={onSendOtp}
                                                    >
                                                        {t("resend", { defaultValue: "Resend" })}
                                                    </Button>
                                                ) : (
                                                    <Text type="secondary">
                                                        {t("resend", { defaultValue: "Resend" })}
                                                    </Text>
                                                )}
                                            </Space>
                                        </Space>
                                    </Form>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Content>
            </Layout>
        </React.Fragment>
    );
}
export default Login;