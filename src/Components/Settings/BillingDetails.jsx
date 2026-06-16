import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import PhoneInput from 'antd-phone-input'
import Dragger from 'antd/es/upload/Dragger';
import { t } from 'i18next';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { saveBillingDetails } from './SettingApi';

function BillingDetails() {

    const [phone, setPhone] = useState("");
    const theme = useSelector((state) => state?.app?.theme);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        console.log("Form Values:", values);
        try {
            const payload = {
                businessName: values.name,
                gst: values.gst_number,
                email: values.email,
                phone: phone,
                address: values.address,
                logo: values.media,
            };

            const data = await saveBillingDetails(payload);

            if (data?.status) {
                message.success(
                    data?.message || "Billing details saved successfully"
                );
            }
        } catch (error) {
            console.log(error);
            message.error("Failed to save billing details");
        }
    };

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""
                }${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };

    return (
        <Card
            style={{
                borderRadius: 0,
                borderColor: theme ? "transparent" : "#fff",
            }} >
            <Form form={form}
                layout="vertical"
                onFinish={handleSubmit}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("bussiness.name", { defaultValue: "Business Name" })}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter business name",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("bussiness.name", { defaultValue: "Enter Your Bussiness Name", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("gst.number", { defaultValue: "GST Number" })}
                            name="gst_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter gst number",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("gst.number", { defaultValue: "Enter Your GST Number", })} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 16]} gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("email", { defaultValue: "Email" })}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter email",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("email", { defaultValue: "Enter Your Email", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            name="phone"
                            label={t("phone.number", { defaultValue: "Phone Number" })}
                            initialValue={phone}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter phone",
                                },
                            ]}
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

                    </Col>
                </Row>

                <Row gutter={[24, 16]} gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("address", { defaultValue: "Address" })}
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter address",
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("address", { defaultValue: "Enter Your  Address", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("media", { defaultValue: "Media" })}
                            name="media"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter media",
                                },
                            ]}
                        >
                            <Card size="small" >
                                <Dragger style={{ padding: "20px" }}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>

                                    <p className="ant-upload-text">
                                        {t("drag.file.upload", { defaultValue: "Drag File Upload" })}
                                    </p>
                                </Dragger>
                            </Card>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 16]} justify="space-between" align="middle">
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <span>Last Update: </span>
                    </Col>

                    <Col>
                        <Button type="primary" htmlType='submit'>
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default BillingDetails;