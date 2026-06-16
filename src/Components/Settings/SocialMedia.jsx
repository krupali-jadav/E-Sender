import { FacebookFilled, InstagramFilled, LinkedinFilled, TwitterSquareFilled, YoutubeFilled } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, message, Row } from "antd"
import { t } from "i18next"
import { useSelector } from "react-redux";
import { saveSocialMedia } from "./SettingApi";

function SocialMedia() {
  const [form] = Form.useForm();
  const theme = useSelector((state) => state?.app?.theme);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    try {
      const payload = {
        linkedin: values.linkedin,
        facebook: values.facebook,
        twitter: values.twitter,
        instagram: values.instagram,
        youtube: values.youtube
      };

      const data = await saveSocialMedia(payload);

      if (data?.status) {
        message.success(
          data?.message || "Social media details saved successfully"
        );
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to save social media details");
    }
  };
  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
      }} >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("linkedin", { defaultValue: "LinkedIn" })}
              name="linkedin"
              rules={[
                {
                  required: true,
                  message: "Please enter LinkedIn URL",
                },
              ]}
            >
              <Input
                prefix={<LinkedinFilled />}
                placeholder={t("linkedin.url", { defaultValue: `Enter LinkedIn URL`, })} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("facebook", { defaultValue: "Facebook" })}
              name="facebook"
              rules={[
                {
                  required: true,
                  message: "Please enter Your Facebook",
                },
              ]}
            >
              <Input
                prefix={<FacebookFilled />}
                placeholder={t("facebook", { defaultValue: `Enter Your Facebook`, })} />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("twitter", { defaultValue: "Twitter" })}
              name="twitter"
              rules={[
                {
                  required: true,
                  message: "Please enter Twitter",
                },
              ]}
            >
              <Input
                prefix={<TwitterSquareFilled />}
                placeholder={t("twitter", { defaultValue: `Enter Your Twitter`, })} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("instagram", { defaultValue: "Instagram" })}
              name="instagram"
              rules={[
                {
                  required: true,
                  message: "Please enter Your Instagram",
                },
              ]}
            >
              <Input
                prefix={<InstagramFilled />}
                placeholder={t("instagram", { defaultValue: `Enter Your Instagram`, })} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("youtube", { defaultValue: "YouTube" })}
              name="youtube"
              rules={[
                {
                  required: true,
                  message: "Please enter Your YouTube",
                },
              ]}
            >
              <Input
                prefix={<YoutubeFilled />}
                placeholder={t("youtube", { defaultValue: `Enter Your YouTube`, })} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" gutter={[24, 16]}>
          <Col xs={24} sm={24} lg={12}>
            Last Updated:
          </Col>
          <Col >
            <Button type="primary" htmlType="submit">Save</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default SocialMedia