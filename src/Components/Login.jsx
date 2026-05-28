import React, { useEffect, useRef, useState } from "react";
import '../../src/index.css';
import {
    Tooltip,
    Button,
    Col,
    Form,
    Row,
    Space,
    Typography,
    message,
    Input,
    Checkbox,
    Divider,
    Card,
    Layout,
    Flex,
    Image,
} from "antd";
import {
    EditOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import PhoneInput from "antd-phone-input";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../redux/reducers/Reducer.user";
import { getMediaPath } from "../util/getMediaPath";
import axiosInstance from "../util/axiosInstance";


const { Text, Title } = Typography;
const { Content } = Layout;

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

    const otpValid = otp.length === 6;
    const canSendOtp = checkTerms && phone !== "";
    const countdown = tick > 0 ? `00:${String(tick).padStart(2, "0")}` : "";

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

            console.log("Phone:", fullPhoneNumber);

            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };

    // const onSendOtp = () => {
    //   setLoading(true);
    //   setTick(30);
    //   setResend(false);
    //   setOtp("");
    //   setTimeout(() => {
    //     setIsLoginPage(false);
    //     message.success(`OTP sent to ${phone || "your number"}`);
    //     setLoading(false);
    //   }, 700);
    // };

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
            console.log("send otp", data);

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

    // const onOtpVerify = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         if (otp === "123456") {
    //             const userData = { phone, isLoggedIn: true };
    //             dispatch(setUserDetails(userData));
    //             message.success("Login Successfully");
    //             console.log(userData);
    //         } else {
    //             message.error("Invalid OTP");
    //         }
    //         setLoading(false);
    //     }, 700);
    // }
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
          ("login.loginSuccessfully", { defaultValue: "Login Successfully" }),
        );
        dispatch(setUserDetails(data));
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <Layout style={{ minHeight: "100vh", }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                    {isLoginPage ? (
                        <Col xs={22} sm={18} md={12} lg={8} xl={5}>
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
                                        label="Phone Number"
                                        initialValue={phone}
                                    >
                                        <PhoneInput
                                            enableSearch
                                            country={"in"}
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

                                    <Form.Item>
                                        <Space direction="vertical">
                                            <Space>
                                                <Checkbox
                                                    checked={checkTerms}
                                                    onChange={(e) =>
                                                        setCheckTerms(e.target.checked)
                                                    }
                                                >
                                                    Keep me signed in
                                                </Checkbox>

                                                <Tooltip title="This will keep you signed in until you manually sign out">
                                                    <ExclamationCircleOutlined />
                                                </Tooltip>
                                            </Space>

                                            <Divider />

                                            <Text type="secondary">
                                                By continuing, you agree to our{" "}
                                                <Link
                                                    to="/privacy-policy"
                                                    target="_blank"
                                                >
                                                    Privacy Policy
                                                </Link>{" "}
                                                &{" "}
                                                <Link
                                                    to="/terms-and-conditions"
                                                    target="_blank"
                                                >
                                                    Terms and Conditions
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
                                            Send OTP
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    ) : (
                        <Col xs={22} sm={18} md={12} lg={8} xl={5}>
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
                                            We've sent a verification code to{" "}
                                            <b>{phone}</b>

                                            <Button
                                                type="link"
                                                icon={<EditOutlined />}
                                                onClick={() => setIsLoginPage(true)}
                                            />
                                        </Text>

                                        <Form.Item label="Enter OTP">
                                            <Input.OTP length={6}
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
                                                Submit
                                            </Button>
                                        </Form.Item>

                                        <Space>
                                            <Text>Didn't get the OTP?</Text>
                                            {resend ? (
                                                <Button
                                                    type="link"
                                                    onClick={onSendOtp}
                                                >
                                                    Resend
                                                </Button>
                                            ) : (
                                                <Text type="secondary">
                                                    Resend
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
    );
}

export default Login;