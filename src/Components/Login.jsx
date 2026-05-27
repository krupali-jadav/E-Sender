
import React, { useEffect, useRef, useState } from "react";
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
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import PhoneInput from "antd-phone-input";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/UserSlice";

const { Text, Title } = Typography;

const formatDigits = (value) => {
  const raw = typeof value === "string"
    ? value
    : value?.target?.value || value?.value || value?.phone || "";
  const area = value?.areaCode || "";
  const phoneNumber = value?.phoneNumber || "";
  const combined = area || phoneNumber ? `${area}${phoneNumber}` : raw;
  return combined.replace(/\D/g, "").slice(-10);
};

function Login() {
  const otpRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkTerms, setCheckTerms] = useState(true);
  const [tick, setTick] = useState(30);
  const [resend, setResend] = useState(false);
  const dispatch = useDispatch();

  const otpValid = otp.length === 6;
  const canSendOtp = checkTerms && phone.length === 10;
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
    if (!value) return setPhone("");
    if (value?.target) return setPhone(formatDigits(value.target.value));
    if (typeof value === "string") return setPhone(formatDigits(value));
    if (typeof value.valid === "function" && !value.valid()) return setPhone("");
    setPhone(formatDigits(value));
  };

  const onSendOtp = () => {
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
    setLoading(true);
    setTimeout(() => {
      if (otp === "123456") {
        const userData = { phone, isLoggedIn: true };
        dispatch(setUserDetails(userData));
        message.success("Login Successfully");
        console.log(userData);
      } else {
        message.error("Invalid OTP");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
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
                  <div style={{ display: "flex", justifyContent: "center" }} />
                  <Form.Item name="phone" label="Phone Number" initialValue={phone}>
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

                  <Form.Item style={{ maxWidth: 300 }}>
                    <Checkbox onChange={(e) => setCheckTerms(e.target.checked)} defaultChecked>
                      Keep me signed in
                    </Checkbox>
                    <Text type="secondary">
                      <Space>
                        <Tooltip title="This will keep you signed in until you manually sign out">
                          <ExclamationCircleOutlined />
                        </Tooltip>
                      </Space>
                    </Text>
                    <Divider />
                    <Text>
                      By continuing, you agree to our <Link to="/privacy-policy" target="_blank">Privacy Policy</Link> &amp;{' '}
                      <Link to="/terms-and-conditions" target="_blank">Terms and Conditions</Link>
                    </Text>
                  </Form.Item>

                  <Button type="primary" htmlType="submit" loading={loading} disabled={!canSendOtp} style={{ width: "100%" }}>
                    Send OTP
                  </Button>
                </Card>
              </Form>
            </Col>
          ) : (
            <Col sm={24} md={10} xl={10}>
              <Form layout="vertical" onFinish={onOtpVerify} style={{ width: 370 }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "center" }} />
                  <Space direction="vertical">
                    <Text className="font-regular" type="primary">
                      We've sent a verification code to <b>{phone}</b>
                      <EditOutlined onClick={() => setIsLoginPage(true)} style={{ marginLeft: 8 }} />
                    </Text>
                    <Form.Item label="Enter OTP" style={{ marginBottom: 0 }}>
                      <Input
                        ref={otpRef}
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                        onPressEnter={onOtpVerify}
                        style={{ height: 45, marginBottom: 0 }}
                      />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Text type="secondary">
                        <Title level={5} style={{ marginTop: 0 }} type="secondary">
                          {countdown}
                        </Title>
                      </Text>
                    </div>
                    <Form.Item>
                      <Button block type="primary" htmlType="submit" loading={loading} disabled={!otpValid}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Space>
                  <Form.Item>
                    <Space>
                      <Text>Didn't get the OTP?</Text>
                      {resend ? (
                        <Button type="link" onClick={onSendOtp} style={{ padding: 0 }}>
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
