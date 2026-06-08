import { Button, Col, Flex, Form, Input, Row } from 'antd'
import PhoneInput from 'antd-phone-input';
import TextArea from 'antd/es/input/TextArea'
import { t } from 'i18next';
import React, { useState } from 'react'

function BasicInformation() {

  const [phone, setPhone] = useState("");

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
    <Form layout="vertical">
      <Row gutter={[24, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label={t("bussiness_name", { defaultValue: "Business Name" })}
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter business name",
              },
            ]}
          >
            <Input
              placeholder={t("bussiness_name", { defaultValue: "Enter Your Bussiness Name", })} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label={t("business_category", { defaultValue: "Business Category" })}
            name="category"
            rules={[
              {
                required: true,
                message: "Please enter business category",
              },
            ]}
          >
            <Input
              placeholder={t("business_category", { defaultValue: "Enter Your Business Category", })} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 16]}>
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
            label={t("website_url", { defaultValue: "Website Url (Optional)" })}
            name="website_url"
          >
            <Input
              placeholder={t("website_url", { defaultValue: "Enter Website Url", })} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 16]}>
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
            label={t("phone_number", { defaultValue: "Phone Number" })}
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
              placeholder={t("phone_number", { defaultValue: "Enter Phone Number" })}
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

      <Form.Item
        label={t("about_your_business", { defaultValue: "About Your Business" })}
        name="about_your_business"
        rules={[
          {
            required: true,
            message: "Please enter about your business",
          },
        ]}
      >
        <TextArea rows={5}
          placeholder={t("about_your_business", { defaultValue: "Enter About Your Business", })} />
      </Form.Item>

      <Row gutter={[24, 16]} justify="space-between" align="middle" >
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
  )
}

export default BasicInformation;