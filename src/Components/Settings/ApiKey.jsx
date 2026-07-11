import { Button, Card, Col, Input, message, Space, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { generateApiKey } from "./SettingApi";
import { t } from "i18next";
const { Text } = Typography;
function ApiKey() {
  const theme = useSelector((state) => state?.app?.theme);
  const [visible, setVisible] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) {
      message.warning("No API Key available");
      return;
    }

    await navigator.clipboard.writeText(apiKey);
    message.success("API Key copied");
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const data = await generateApiKey();

      if (data?.status) {
        setApiKey(data.apiKey);

        message.success(
          data?.message || "API key generated successfully"
        );
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col xs={24} sm={24} md={20} lg={18} xl={16} xxl={10}>
      <Card
        style={{
          borderRadius: 0,
          borderColor: theme ? "transparent" : "#fff",
        }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>
            {t("your.api.key", { defaultValue: "Your API Key" })}
          </Text>

          <Input.Group compact>
            <Input.Password
              value={apiKey}
              readOnly
              visibilityToggle={{
                visible,
                onVisibleChange: setVisible,
              }}
              suffix={
                <Typography.Text
                  copyable={{
                    text: apiKey,
                  }}
                />
              }
              style={{ width: "82%" }}
            />
            <Button
              type="primary"
              loading={loading}
              onClick={handleGenerate}
            >
              {t("generate", { defaultValue: "Generate" })}
            </Button>
          </Input.Group>
        </Space>
      </Card>
    </Col>
  );
}
export default ApiKey;