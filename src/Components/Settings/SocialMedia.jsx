import { FacebookFilled, InstagramFilled, LinkedinFilled, TwitterSquareFilled, YoutubeFilled } from "@ant-design/icons"
import { Button, Col, Form, Input, Row } from "antd"
import { t } from "i18next"

function SocialMedia() {
  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label={t("linkdin", { defaultValue: "LinkedIn" })}
            name="linkdin"
            rules={[
              {
                required: true,
                message: "Please enter LinkedIn URL",
              },
            ]}
          >
            <Input
              prefix={<LinkedinFilled />}
              placeholder={t("linkdin_url", { defaultValue: `Enter LinkedIn URL`, })} />
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
            name="linkdin"
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
  )
}

export default SocialMedia